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
        var urlQuery = "http://opentable.herokuapp.com/api/restaurants?";

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
                        "<td class='col-xs-3'>" + name + "</td>" +
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

        // Add the details needed for the selected restaurant here
        
        //after the table is created, with the results from the search, use an onclick event to generate a google maps api map, using the value from the value

        var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + restName + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";

        //jquery to create an iframe inside the #mapWindow div
        $("#mapWindow").append("<iframe>" + apiResult + "</iframe>");

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

