$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAdjOHfLRxKcq4qJt3c6raEsqRwLlr7oVc",
        authDomain: "yumyumnav.firebaseapp.com",
        databaseURL: "https://yumyumnav.firebaseio.com",
        projectId: "yumyumnav",
        storageBucket: "",
        messagingSenderId: "947863423856"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    //set global variables for the input fields
    var zipCode = '';
    var restName = '';
    var city = '';
    // OpenTable base API to generate the search results
    var urlQuery = "https://opentable.herokuapp.com/api/restaurants?";

    $("#submit").on("click", function(event) {
        event.preventDefault();

        //disable all input fields
        for (var d = 0; d < 3; d++) {
            $("input")[d].disabled = true;
        }

        zipCode = $("#zip").val().trim();
        restName = $("#restaurant-name").val().trim();
        city = $("#city").val().trim();
        var url = '';

        // Input validations
        if (zipCode) {
            if (isNaN(zipCode) || zipCode.length < 5) {
                modalZip();
                return false;
            }
        } 
        if ((zipCode === '') && (restName === '') && (city === '')) {
            modalEmpty();
            return false;
        } 
        if ((zipCode !== '') && (city !== '')) {
            modalBoth();
            return false;
        }

        var regex = /\W|_/g;

        // Start searching OpenTable based on user's inputs
        if (zipCode) {
            if (restName) {
                url = urlQuery + "name=" + restName + "&zip=" + zipCode;
                searchOpenTable(url);
            } else {
                url = urlQuery + "zip=" + zipCode;
                searchOpenTable(url);
            }
        } else if (city) {
            if (restName) {
                url = urlQuery + "name=" + restName + "&city=" + city;
                searchOpenTable(url);
            } else {
                url = urlQuery + "city=" + city;
                searchOpenTable(url);
            }
        } else {
            url = urlQuery + "name=" + restName;
            searchOpenTable(url);
        }

        // Code for pushing people's search to Firebase
        database.ref().push ({
            zipCode: zipCode,
            restName: restName,
            city: city
        });

        // Clear out the input fields
        $("#zip").val('');
        $("#restaurant-name").val('');
        $("#city").val('');
    });

    //Created click event for location.reload() when modal is closed out
    // $('#close').on("click", function() {
    //     location.reload();
    // })
    $(document).on("click", "#close", function() {
        location.reload();
    })

    $(document).on("click", ".table-row", function() {
        // Remove table before displaying Details page
        $("#restaurant-table").remove();

        // Capture the restaurant name and save it in detailsName variable
        var detailsName = $(this).contents()[1].outerText;

        //Search for restaurant name
            var restQuery = urlQuery + "name=" + detailsName;
            console.log(restQuery);
            $.ajax({
                url: restQuery,
                method: "GET"
            })
            .then(function(response) {
                console.log(response);
                if (response.total_entries > 0) {
                    var rest = response.restaurants;
                    var address = rest[0].address;
                    var city = rest[0].city;
                    var state = rest[0].state;
                    var zip = rest[0].postal_code;
                    var phoneNumber = rest[0].phone;
                    var name = rest[0].name;
                    var price = rest[0].price;
                    var reserve = rest[0].reserve_url;
                    var image_url = rest[0].image_url;
                    var image = "<img src=" + image_url + " alt='image' class='restaurant-image'>";

                    var piggies = '';
                    for (var j = 1; j <= price; j++) {
                        piggies = piggies + '<i class="fas fa-piggy-bank"></i>';
                    }
            
                    $('#details-page').append("<br>" +
                    "<br>" + image + "<br>" +
                    "<p>" + name + "</p>" +
                    "<p>" + address + "</p>" +
                    "<p>" + city + ", " + state + ", " + zip + "</p>" +
                    "<p><i class='fas fa-phone-square'></i> " + phoneNumber + "</p>" +
                    "<p>Price Range: "  + piggies + "</p>" +
                    "<p> Make reservations <a href='" + reserve + "'target='_blank'>here</a><br>");
               
                    renderMap();

                } else {
                    modalZero();
                }
            });
        
        // Set the API URL with the restaurant name to a variable
        function renderMap () {
            console.log(city);
            console.log(zip);
            var space = "%20";
            var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + detailsName + space + zip + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";
            console.log(apiResult);
            // create iframe emelment and set that to a variable with the API result URL
            var addIframe = $('<iframe />', {
                id: 'map', 
                name: 'map',
                src: apiResult,
                height: "450",
                width: "600" 
            });
        
            $("#mapWindow").append(addIframe);
    };

        // Start the "Others Searched" section
        $("table.others-search").append("<caption>" + 'Others Also Searched...' + '</caption>');
        $("#others-search-table-head").append("<tr><th>Restaurant Name</th><th>City</th><th>Zip</th><tr>"); 
        
        database.ref().limitToLast(10).on("child_added", function(childSnapshot) {
            const firebaseData = childSnapshot.val();
            $("#others-search-table-body").append("<tr><td>" + firebaseData.restName + "</td><td>" + firebaseData.city + "</td><td>" + firebaseData.zipCode + "</td></tr>");
        }, function(errorObject){
            console.log("Errors handled: " + errorObject.code)
        });
    });

    var array = ["stuff1", "stuff2", "stuff3"];
    //autocomplte code
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
            });
      }

      autocomplete(document.getElementById("autocompleteCity"), array);
    //   autocomplete(document.getElementById("myInput"), countries);
    //   autocomplete(document.getElementById("myInput"), countries);


    // Create functions for each modal
    function modalZip() {
        $('#modal-zip').modal('show');
    }

    function modalEmpty() {
        $('#modal-empty').modal('show');
    }

    function modalBoth() {
        $('#modal-both').modal('show');
    }

    function modalZero() {
        $('#modal-zero').modal('show');
    }

    function searchOpenTable(restQuery) {
        $.ajax({
            url: restQuery,
            method: "GET"
        })
        .then(function(response) {
            console.log(response);

            if (response.total_entries > 0) {
                var rest = response.restaurants;
                for (var i = 0; i < rest.length; i++) {
                    var address = rest[i].address;
                    var name = rest[i].name;
                    var price = rest[i].price;
                    var image_url = rest[i].image_url;
                    var image = "<img src=" + image_url + " alt='image' class='restaurant-image'>";

                    var piggies = '';
                    for (var j = 1; j <= price; j++) {
                        piggies = piggies + '<i class="fas fa-piggy-bank"></i>';
                    }
            
                    $('#search-results').append("<tr class='table-row'>" +
                    "<td class='col-xs-3'>" + image + "</td>" +
                    "<td class='col-xs-3 openRest'>" + name + "</td>" +
                    "<td class='col-xs-3'>" + address + "</td>" +
                    "<td class='col-xs-3'>"  + piggies + "</tr>");

                    if (i === 9) {
                        break;
                    }
                }
            } else {
                modalZero();
            }
        });
    };
});

