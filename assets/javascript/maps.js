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

    // Hide restaurant table and others table when page is loaded
    $("#restaurant-table").hide();
    $("#others").hide();

    // OpenTable base API to generate the search results
    var urlQuery = "https://opentable.herokuapp.com/api/restaurants?";

    $("#submit").on("click", function(event) {
        event.preventDefault();

        // show restaurant table
        $("#restaurant-table").show();

        //disable all input fields
        for (var d = 0; d < 3; d++) {
            $("input")[d].disabled = true;
        }

        zipCode = $("#zip").val().trim();
        restName = ($("#restaurant-name").val().trim()).toUpperCase();
        city = ($("#city").val().trim()).toUpperCase();
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

        // Clear out the input fields
        $("#zip").val('');
        $("#restaurant-name").val('');
        $("#city").val('');
    });

    //Created click event for location.reload() when modal is closed out
    $(document).on("click", "#close", function() {
        location.reload();
    })

    $(document).on("click", ".table-row", function() {
        // Remove table before displaying Details page
        $("#restaurant-table").remove();

        // show others searched table
        $("#others").show()

        // Capture the restaurant info from HTML table
        var detailsState = '';
        var detailsCity = '';
        var detailsZip = '';
        var detailsName = '';
        var detailsAddress = '';
        var detailsImageUrl = '';
        var detailsPrice = 0;
        var detailsPhone = '';
        var detailsReserve = '';

        detailsName = $(this).find('.restaurant-res-name').attr("data-restaurant-name");
        detailsAddress = $(this).find('.restaurant-address').attr("data-restaurant-address");
        detailsImageUrl = $(this).find('.restaurant-image').attr("data-restaurant-imageurl");
        detailsPrice = $(this).find('.restaurant-price').attr("data-restaurant-price");
        detailsCity = $(this).find('.restaurant-price').attr("data-restaurant-city");
        detailsZip = $(this).find('.restaurant-price').attr("data-restaurant-zip");
        detailsPhone = $(this).find('.restaurant-price').attr("data-restaurant-phone");
        detailsReserve = $(this).find('.restaurant-price').attr("data-restaurant-reserve-url");
        detailsState = $(this).find('.restaurant-price').attr("data-restaurant-state");

        // Code for pushing people's search to Firebase
        database.ref().push ({
            zipCode: detailsZip,
            restName: detailsName.toUpperCase() ,
            city: detailsCity.toUpperCase() 
        });
        
        var image = "<img src=" + detailsImageUrl + " alt='image' class='restaurant-image' id='detail-image'>";

        var piggies = '';
        for (var j = 1; j <= detailsPrice; j++) {
            piggies = piggies + '<i class="fas fa-piggy-bank"></i>';
        }

        $('#details-page').append("<br>" +
        "<br>" + image + "<br>" +
        "<h3>" + detailsName + "</h3>" +
        "<p>" + detailsAddress + "</p>" +
        "<p>" + detailsCity + ", " + detailsState + ", " + detailsZip + "</p>" +
        "<p><i class='fas fa-phone-square'></i> " + detailsPhone + "</p>" +
        "<p>Price Range: "  + piggies + "</p>" +
        "<p> Make reservations <a href='" + detailsReserve + "'target='_blank'>here</a><br>");
    
        renderMap(detailsName, detailsCity, detailsZip);

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
    var cityAutoComp = [];
    var restNameAutoComp = [];
    var zipCodeAutoComp = [];
    //Listener that handles autocomplete
    database.ref().on("child_added", function(snap) {
        if(snap.val().city !== '' && (cityAutoComp).indexOf(snap.val().city) === -1) {
            cityAutoComp.push(snap.val().city);
        } 
        if (snap.val().restName !== '' && (restNameAutoComp).indexOf(snap.val().restName) === -1) {
            restNameAutoComp.push(snap.val().restName); 
        } 
        if(snap.val().zipCode !== '' && (zipCodeAutoComp).indexOf(snap.val().zipCode) === -1) {
            zipCodeAutoComp.push(snap.val().zipCode);
        }
    });
    
    $("#city").autocomplete({
        source: cityAutoComp
    });

    $("#zip").autocomplete({
        source: zipCodeAutoComp
    });

    $("#restaurant-name").autocomplete({
        source: restNameAutoComp
    });
    
    // Create functions for each modal
    function modalZip() {
        $('#modal-zip').modal('show');
    };

    function modalEmpty() {
        $('#modal-empty').modal('show');
    };

    function modalBoth() {
        $('#modal-both').modal('show');
    };

    function modalZero() {
        $('#modal-zero').modal('show');
    };

    function renderMap(detailsName, detailsCity, detailsZip) {
        detailsName = encodeURIComponent(detailsName);

        var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + detailsName + detailsCity + detailsZip + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";

        // create iframe emelment and set that to a variable with the API result URL
        var addIframe = $('<iframe />', {
            id: 'map', 
            name: 'map',
            src: apiResult
        });
    
        $("#mapWindow").append(addIframe);
    };

    function searchOpenTable(restQuery) {
        $.ajax({
            url: restQuery,
            method: "GET"
        })
        .then(function(response) {
            var address = [];
            var name = [];
            var image_url = [];
            var price = [];
            var resCity = [];
            var reserve_url = [];
            var resZip = [];
            var resState = [];
            var resPhone = [];

            if (response.total_entries > 0) {
                var rest = response.restaurants;
                for (var i = 0; i < rest.length; i++) {
                    resPhone.push(rest[i].phone);
                    resState.push(rest[i].state);
                    resCity.push(rest[i].city);
                    reserve_url.push(rest[i].reserve_url);
                    address.push(rest[i].address);
                    resZip.push(rest[i].postal_code);
                    name.push(rest[i].name);
                    price.push(rest[i].price);
                    image_url.push(rest[i].image_url);
                    var image = "<img src=" + rest[i].image_url + " alt='image' class='rest-image'>";

                    var piggies = '';
                    for (var j = 1; j <= rest[i].price; j++) {
                        piggies = piggies + '<i class="fas fa-piggy-bank"></i>';
                    }
            
                    $('#search-results').append("<tr class='table-row'>" +
                    "<td class='col-xs-3 restaurant-image'>" + image + "</td>" +
                    "<td class='col-xs-3 restaurant-res-name'>" + rest[i].name + "</td>" +
                    "<td class='col-xs-3 restaurant-address'>" + rest[i].address + "</td>" +
                    "<td class='col-xs-3 restaurant-price'>"  + piggies + "</td></tr>");

                    if (i === 9) { 
                        break;
                    }
                }
            } else {
                modalZero();
            }
            
            addDataAttributes(address, name, price, image_url, resCity, resZip, reserve_url, resState, resPhone); 
        });
        
    };

    function addDataAttributes(address, name, price, image_url, resCity, resZip, reserve_url, resState, resPhone) {
        // This function is to loop through the newly created table rows and add data-attribute to each of them.

        $.each($(".restaurant-res-name"), function(index, item) {
            $(item).attr('data-restaurant-name', name[index]);
        });

        $.each($(".restaurant-address"), function(index, item) {
            $(item).attr('data-restaurant-address', address[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-price', price[index]);
        });

        $.each($(".restaurant-image"), function(index, item) {
            $(item).attr('data-restaurant-imageurl', image_url[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-city', resCity[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-reserve-url', reserve_url[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-zip', resZip[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-state', resState[index]);
        });

        $.each($(".restaurant-price"), function(index, item) {
            $(item).attr('data-restaurant-phone', resPhone[index]);
        });
    };
});

