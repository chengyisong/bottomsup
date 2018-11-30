// Bottoms Up -- Wilder Molyneux -- firebase.js -- 11/29/18

// Initialize Firebase on chengyison account for both additions and display
$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCFqAd4UK2fTREHACjWb725Pvp3pKI4PwM",
        authDomain: "uwbottomsup.firebaseapp.com",
        databaseURL: "https://uwbottomsup.firebaseio.com",
        projectId: "uwbottomsup",
        storageBucket: "uwbottomsup.appspot.com",
        messagingSenderId: "844557366354"
    };
    firebase.initializeApp(config);

});
    