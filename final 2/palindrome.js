/* ============================================================
   palindrome.js - EXTERNAL JavaScript for palindrome.html
   CSC102 Final Project: A Web Presence
   Author: Larry Douglas

   Checks whether the submitted text reads the same backward.
   The result goes into the page with innerHTML - no alerts.
   No addEventListener is used. The form's onsubmit property is
   set here in the external file instead, so there is no
   JavaScript written inside the HTML either.
   ============================================================ */

// Grab the two elements this page works with: the form and the result box
var palindromeForm = document.getElementById("palindromeForm");
var resultBox = document.getElementById("palindromeResult");

// Clear the "Waiting for JS to load..." placeholder now that the file ran
resultBox.innerHTML = "Type a word or phrase above and press Check it.";


/* checkPalindrome()
   Runs when the form is submitted. Returns false at the end so the
   browser does not reload the page and wipe the result off the screen. */
function checkPalindrome() {

  // Read whatever the user typed. .value is always a string.
  var original = document.getElementById("phraseInput").value;

  // Step 1: strip everything that is not a letter or a number.
  // Step 2: force it all to lower case so "Bob" matches "bob".
  var cleaned = original.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Guard clause: nothing usable was typed, so say so and stop early
  if (cleaned === "") {
    resultBox.className = "message msg-hint";
    resultBox.innerHTML = "Nothing to check yet. Type a word or a phrase first.";
    return false;
  }

  // Step 3: reverse the cleaned copy. split makes an array of characters,
  // reverse flips that array, join glues it back into a string.
  var reversed = cleaned.split("").reverse().join("");

  // Step 4: compare. If the two strings match, it is a palindrome.
  if (cleaned === reversed) {
    resultBox.className = "message msg-pass";
    resultBox.innerHTML =
      "<strong>Yes.</strong> \"" + original + "\" is a palindrome. Cleaned up it reads <em>" +
      cleaned + "</em> in both directions.";
  } else {
    resultBox.className = "message msg-fail";
    resultBox.innerHTML =
      "<strong>No.</strong> \"" + original + "\" is not a palindrome. Cleaned it is <em>" +
      cleaned + "</em>, but backward it is <em>" + reversed + "</em>.";
  }

  // Returning false cancels the form's normal submit and page reload
  return false;
}

// Hand the function to the form's onsubmit property. This is an assignment
// in an external file, not an event listener and not inline HTML.
palindromeForm.onsubmit = checkPalindrome;
