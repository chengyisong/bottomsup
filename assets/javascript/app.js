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

var configAdd = {
    apiKey: "AIzaSyCFqAd4UK2fTREHACjWb725Pvp3pKI4PwM",
    authDomain: "uwbottomsup.firebaseapp.com",
    databaseURL: "https://uwbottomsup.firebaseio.com",
    projectId: "uwbottomsup",
    storageBucket: "uwbottomsup.appspot.com",
    messagingSenderId: "844557366354"
  };

firebase.initializeApp(configAdd);

// Create a variable to reference the database
var databaseAdd = firebase.database();

// Variable for user submitted drinks
let userSubmittedDrink = {          

    // Property-value pairs
    userName: "",                   // Name of user
    nameOfDrink: "",                // Name of beverage
    ingredients: [],                // Ingredients array
    instructions: ""                // Instructions for recipe
};

// Capture button click for recipe submission
$("#submit-drink-button").on("click", function(event) {

    // Don't refresh the page!
    event.preventDefault();

    // Capture inputs locally to push to Firebase database
    userSubmittedDrink.userName = $("#user-name-input").val().trim();
    userSubmittedDrink.nameOfDrink = $("#drink-name-input").val().trim();
    userSubmittedDrink.instructions = $("#ingredient-input-instructions").val().trim();

    // Loop through ingredients inputs
    for (let i = 1; i <= 5; i++) {

        // Local variables for data input gathering
        let quantityID   = "#ingredient-input-quantity-" + i;
        let unitsID      = "#ingredient-input-units-" + i;
        let ingredientID = "#ingredient-input-name-" + i;

        // Get user input values
        // let tempQuantity = 0
        // tempQuantity = $(quantityID).val().trim();

        let tempQuantity = $(quantityID).val().trim();

        if (tempQuantity != "") {
        // if (typeof tempQuantity == 'undefined') {
            
            // build an ingredient array element and push it
            let tempUnits = $(unitsID).val().trim();
            let tempIngredientName = $(ingredientID).val().trim();

            let ingredientPush = {
                ingredientQuantity: tempQuantity,      
                ingredientUnits: tempUnits,     
                ingredientName: tempIngredientName   
            };

            userSubmittedDrink.ingredients.push(ingredientPush);
            
        } // End quantity if statement
    } // End ingredient gathering loop

    // testing
    console.log(userSubmittedDrink);

    // Validate user input
    // TO BE WRITTEN
    

    // Update Firebase database
    databaseAdd.ref().push({                   // Using .push from .set for data additions over replacement

        userSubmittedDrink: userSubmittedDrink 
    });

}); // End Capture button click for recipe submission

