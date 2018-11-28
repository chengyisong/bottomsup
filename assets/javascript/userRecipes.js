$( document ).ready(function() {
  // Initialize Firebase
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
  database.ref().on("child_added", function(snapshot){
      console.log("child_added!!!");
      console.log(snapshot.toJSON());
      let key = snapshot.key;
      console.log("key is " + key);
      // Push all drinks (as objects) into the drinkList array
      drinkList.push(snapshot.toJSON());
  })

 
  // Show a button for each of the user created drink. Using setTimeout to make sure these are run after all data have been retrieved from Firebase (aka the "chilc_added" function above)
  setTimeout(function() {
    // Go through the drinkList Array to get each of the drink
    for (var i=0; i<drinkList.length; i++) {
      var buttonName = drinkList[i].nameOfDrink;
      var newBtn = $("<button>");
      // add class (for the onclick event)
      $(newBtn).addClass("drinkBtn");
      // add class (for bootstrap style)
      $(newBtn).addClass("btn-info");
      // add data-num attribute to label each drink button with the index (so that info can be pulled from the array when button is clicked)
      $(newBtn).attr("data-num",i);
      $(newBtn).text(buttonName);
      $("#btnArea").append(newBtn);
      console.log(buttonName);
    }
  }, 1000);

  // When each of the drink button is clicked...
  $(document).on("click",".drinkBtn", function(){
    // use index to find the drink selected in the drinkList array
    let drinkIndex = $(this).attr("data-num");
    // display drink name in the card header
    $("#userDrink").text(drinkList[drinkIndex].nameOfDrink);
    // display drink name in the card body
    $("#userDrink1").text(drinkList[drinkIndex].nameOfDrink);
    // display user name
    $("#userName").text(drinkList[drinkIndex].userName);
    // display ingredients
      var ingDisplay= $("<li>");
      $("#userIng").empty();
      $(ingDisplay).text(drinkList[drinkIndex].ingredients.ingredientQuantity + " " + drinkList[drinkIndex].ingredients.ingredientUnits + " of " + drinkList[drinkIndex].ingredients.ingredientName);
      $("#userIng").append(ingDisplay);
    
    // display instructions
    $("#userInst").text(drinkList[drinkIndex].instructions)
  })
})