// Bottoms Up -- Carrie Song -- userRecipe2.js -- 11/29/18, updated by Wilder Molyneux

$( document ).ready(function() {

  // Initialize Firebase for display
  var config = {
    apiKey: "AIzaSyCFqAd4UK2fTREHACjWb725Pvp3pKI4PwM",
    authDomain: "uwbottomsup.firebaseapp.com",
    databaseURL: "https://uwbottomsup.firebaseio.com",
    projectId: "uwbottomsup",
    storageBucket: "uwbottomsup.appspot.com",
    messagingSenderId: "844557366354"
  };
  firebase.initializeApp(config);

  // Define Variables
  let database = firebase.database()
  let drinkList = [];

  // Get all data from Firebase
  database.ref().on("child_added", function(snapshot) {

    // Testing    
    console.log("child_added!!!");
    console.log(snapshot.toJSON());

    let key = snapshot.key;

    // Testing
    console.log("key is " + key);

    // Push all drinks (as objects) into the drinkList array
    drinkList.push(snapshot.toJSON());

  }) // End get all data from Firebase

  // Show a button for each of the user created drink
  // Using setTimeout to make sure these are run after all data has been retrieved from Firebase
  setTimeout(function() {

    // Go through the drinkList Array to get each drink
    for (let i = 0; i < drinkList.length; i++) {

      // Create buttons and append them to page
      var buttonName = drinkList[i].userSubmittedDrink.nameOfDrink;
      var newBtn = $("<button>");

      $(newBtn).addClass("drinkBtn");             // Add class (for the onclick event)
      $(newBtn).addClass("btn-info");             // Add class (for bootstrap style)
      $(newBtn).attr("data-num", i);              // Add data-num attribute to label each drink button with the index
      $(newBtn).text(buttonName);

      $("#btnArea").append(newBtn);               // Append to web page
      
      // Testing
      console.log(buttonName);

    } // End for loop
  }, 1000); // End setTimeout function

  // Button handler for when a drink button is clicked
  $(document).on("click",".drinkBtn", function(){

    // Use index to find the drink selected in the drinkList array
    let drinkIndex = $(this).attr("data-num");

    // Display drink name in the card header
    $("#userDrink").text(drinkList[drinkIndex].userSubmittedDrink.nameOfDrink);

    // Display drink name in the card body
    $("#userDrink1").text(drinkList[drinkIndex].userSubmittedDrink.nameOfDrink);

    // Display user name
    $("#userName").text(drinkList[drinkIndex].userSubmittedDrink.userName);

    // Prep display
    $("#userIng").empty();

    // display ingredients 
    for (let i = 0; i < drinkList[drinkIndex].userSubmittedDrink.numberOfIngredients; i++) {

      let ingDisplay= $("<li>");

      $(ingDisplay).text(drinkList[drinkIndex].userSubmittedDrink.ingredients[i].ingredientQuantity + " " + drinkList[drinkIndex].userSubmittedDrink.ingredients[i].ingredientUnits + " of " + drinkList[drinkIndex].userSubmittedDrink.ingredients[i].ingredientName);

      // Testing
      console.log("Ingredient Name: " + drinkList[drinkIndex].userSubmittedDrink.ingredients[i].ingredientName);

      $("#userIng").append(ingDisplay);

    } // End ingredients loop

    // display instructions
    $("#userInst").text(drinkList[drinkIndex].userSubmittedDrink.instructions)
  })
})
