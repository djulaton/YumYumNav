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

        $('tbody').append("<tr class='table-row'>" +
            "<td class='col-xs-3'>" + 'image' + "</td>" +
            "<td class='col-xs-3'>" + restName + "</td>" +
            "<td class='col-xs-3'>" + 'stree address' + "</td>" +
            "<td class='col-xs-3'>"  + "link" + "</td>" +
            "<td class='col-xs-3'>"  + 'price' + "</tr>");

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
        $(".card").remove();
        
        //after the table is created, with the results from the search, use an onclick event to generate a google maps api map, using the value from the value

        var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + restName + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";

        //jquery to create an iframe inside the #mapWindow div
        $("#mapWindow").append("<iframe>" + apiResult + "</iframe>");
    });
});

