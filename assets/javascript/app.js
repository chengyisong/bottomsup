// Bottoms Up -- Wilder Molyneux -- app.js -- 11/26/18

// Initialize Firebase -- chengyison instance
// 11/26/18 - https://console.firebase.google.com/u/0/project/uwbottomsup/database/data/ SHOWS AN UNKNOWN ERROR WHEN ATTEMPTING TO ACCESS/VIEW

//   var config = {
//     apiKey: "AIzaSyCFqAd4UK2fTREHACjWb725Pvp3pKI4PwM",
//     authDomain: "uwbottomsup.firebaseapp.com",
//     databaseURL: "https://uwbottomsup.firebaseio.com",    
//     projectId: "uwbottomsup",
//     storageBucket: "",                   // THIS SHOULD NOT BE AN EMPTY STRING; example -- storageBucket: "wilder-train-scheduler.appspot.com",
//     messagingSenderId: "844557366354"
//   };
//   firebase.initializeApp(config);

var config = {
    apiKey: "AIzaSyCFqAd4UK2fTREHACjWb725Pvp3pKI4PwM",
    authDomain: "uwbottomsup.firebaseapp.com",
    databaseURL: "https://uwbottomsup.firebaseio.com",
    projectId: "uwbottomsup",
    storageBucket: "uwbottomsup.appspot.com",
    messagingSenderId: "844557366354"
  };

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Variable for user submitted drinks
let userSubmittedDrink = {          

    // Property-value pairs
    userName: "",                   // Name of user
    nameOfDrink: "",                // Name of beverage
    ingredients: [{                 // Ingredients array
        ingredientQuantity: 0,      // Quantity of ingredient
        ingredientUnits: "",        // Units of ingredient
        ingredientName: ""          // Name of ingredient
    }],
    instructions: ""                // Instructions for recipe
};

// Capture Button Click for recipe submission
$("#submit-drink-button").on("click", function(event) {

    // Don't refresh the page!
    event.preventDefault();

    // Capture inputs locally to push to Firebase database
    userSubmittedDrink.userName = $("#user-name-input").val().trim();
    userSubmittedDrink.nameOfDrink = $("#drink-name-input").val().trim();
    userSubmittedDrink
    

    // Validate user input
    

    // Update Firebase database
    database.ref().push({                   // Using .push from .set for data additions over replacement
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });
}); // End add train submit button click event handler

