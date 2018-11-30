// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

// Initialize Firebase
var config = {
  apiKey: "AIzaSyATo1U1zhcEryyhdvV_2NFfiAVE_sO0OC8",
  authDomain: "wilders-first.firebaseapp.com",
  databaseURL: "https://wilders-first.firebaseio.com",
  projectId: "wilders-first",
  storageBucket: "wilders-first.appspot.com",
  messagingSenderId: "579760205799"
};

// Initialize Firebase
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
// var database = ...
var database = firebase.database();

// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the variables for highBidder/highPrice equal to the stored values in firebase.
    highBidder = snapshot.val().highBidder;
    highPrice = parseInt(snapshot.val().highPrice);

    // Change the HTML to reflect the stored values
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text(highPrice);

    // Print the data to the console.
    console.log(highBidder);
    console.log(highPrice);

  }

  // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
  else {

    // Change the HTML to reflect the initial values
    $("#highest-bidder").text(initialBidder);
    $("#highest-price").text(initialBid);

    // Print the data to the console.
    console.log(initialBidder);
    console.log(initialPrice);

  }

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// Whenever a user clicks the submit-bid button
$("#submit-bid").on("click", function(event) {

  // Prevent form from submitting
  event.preventDefault();

  // Get the input values
  let bidderName = $("#bidder-name").val().trim();
  let bidderPrice  = parseInt($("#bidder-price").val().trim());

  console.log(bidderName);
  console.log(bidderPrice);

  // Log the Bidder and Price (Even if not the highest)
  if (bidderPrice > highPrice) {

    // Alert
    alert("You are now the highest bidder.");

    // Save the new price in Firebase
    database.ref().set({                          
      highBidder: highBidder,
      highPrice:  highPrice
    });

    // Log the new High Price
    console.log(highPrice);
    console.log(bidderName);
    console.log(bidderPrice);

    // Store the new high price and bidder name as a local variable
    highPrice  = bidderPrice;
    highBidder = bidderName;

    // Change the HTML to reflect the new high price and bidder
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text(highPrice);

  }

  else {
    // Alert
    alert("Sorry that bid is too low. Try again.");
  }

});
