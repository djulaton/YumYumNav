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

    $("#submit").on("click", function(event) {
        event.preventDefault();
        zipCode = $("#zip").val().trim();
        restName = $("#restaurant-name").val().trim();
        city = $("#city").val().trim();

        // Call OpenTable API to generate the search results
        var urlQuery = "https://opentable.herokuapp.com/api/restaurants?";

        // Search for restaurant name
        if (restName !== '') {
            var restQuery = urlQuery + "name=" + restName;
            $.ajax({
                url: restQuery,
                method: "GET"
            })
            .then(function(response) {
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
                    alert('0 search results');
                }
            });
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

    $(this).on("click", ".table-row", function() {
        // Remove table before displaying Details page
        $("#restaurant-table").remove();
        console.log(this);
        var detailsName = $(this).contents()[1].outerText;

        var urlQuery = "https://opentable.herokuapp.com/api/restaurants?";

        // Search for restaurant name
            var restQuery = urlQuery + "name=" + detailsName;
            $.ajax({
                url: restQuery,
                method: "GET"
            })
            .then(function(response) {
                console.log(response);
                if (response.total_entries > 0) {
                    var rest = response.restaurants;
                        var address = rest[0].address;
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
                        "<br>" + name + "<br>" +
                        "<br>" + address + "<br>" +
                        "<br> Reservation Link: " + reserve + "<br>" +
                        "<br>"  + piggies + "<br>");

                } else {
                    alert('0 search results');
                }
            });
        

        // Add the details needed for the selected restaurant here
        // Set the API URL with the restaurant name to a variable
        var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + restName + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";
        // create iframe emelment and set that to a variable with the API result URL
        var addIframe = $('<iframe />', {
            id: 'map', 
            name: 'map',
            src: apiResult,
            height: "450",
            width: "600" 
        });
        
        //jquery to create an iframe inside the #mapWindow div
        $("#mapWindow").append(addIframe);

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
});

