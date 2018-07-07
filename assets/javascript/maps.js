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

//################################################
//set global variables for the input fields
var zipCode = $("#zip").val().trim();
var restName = $("#restaurant-name").val().trim();
var city = $("#city").val().trim();

//after the table is created, with the results from the search, use an onclick event to generate a google maps api map, using the value from the value

//Still need onclick event from the table row. 

var apiResult = "https://www.google.com/maps/embed/v1/search?q=" + restName + "&key=AIzaSyDzd8udb7o2Ms2UBhL0PVbszc0Seo38DFY";

//jquery to create an iframe inside the #mapWindow div
$("#mapWindow").append("<iframe>" + apiResult + "</iframe>");

