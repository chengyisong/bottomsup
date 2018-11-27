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



