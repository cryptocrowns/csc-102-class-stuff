// =============================================================
// strings.js
// Author: Larry Douglas
// Course: CSC102 - Introductory Programming
// This file holds all the JavaScript. The HTML form calls the
// validateStrings() function below when the user presses submit.
// =============================================================

// This function runs when the form is submitted (see onsubmit in strings.html).
function validateStrings() {

  // Grab what the user typed for the first name, trimming stray end spaces.
  var firstName = document.getElementById("firstName").value.trim();

  // Grab what the user typed for the last name, trimming stray end spaces.
  var lastName = document.getElementById("lastName").value.trim();

  // Grab what the user typed for the zip code, trimming stray end spaces.
  var zipCode = document.getElementById("zipCode").value.trim();

  // Find the spot on the page where we will print messages to the user.
  var output = document.getElementById("output");

  // ---- String manipulation: build the full name variable ----
  // Combine first name + a single space + last name into one variable.
  var fullName = firstName + " " + lastName;

  // ---- Validation 1: make sure the user actually filled the boxes ----
  // If any of the three boxes is empty, warn and stop (do not continue).
  if (firstName === "" || lastName === "" || zipCode === "") {
    // Style the message box as a warning.
    output.className = "output warning";
    // Show the warning text using innerHTML (no alerts allowed).
    output.innerHTML = "\u26A0\uFE0F Please fill in all three boxes before unlocking.";
    // Returning false stops the program AND stops the page from reloading.
    return false;
  }

  // ---- Validation 2: full name must be 20 characters or fewer ----
  // Check whether the combined full name is longer than 20 characters.
  if (fullName.length > 20) {
    // Style the message box as a warning.
    output.className = "output warning";
    // Tell the user the name is too long, using innerHTML.
    output.innerHTML = "\u26A0\uFE0F Your full name is " + fullName.length +
                       " characters. Please keep it to 20 or fewer.";
    // Stop here so the secret stays locked.
    return false;
  }

  // ---- Validation 3: zip code must be exactly 5 digits ----
  // The pattern /^\d{5}$/ means: start, exactly five digits 0-9, end.
  if (!/^\d{5}$/.test(zipCode)) {
    // Style the message box as a warning.
    output.className = "output warning";
    // Tell the user the zip code is not valid, using innerHTML.
    output.innerHTML = "\u26A0\uFE0F That ZIP code is not valid. Enter exactly 5 numbers.";
    // Stop here so the secret stays locked.
    return false;
  }

  // ---- All checks passed: reveal the secret message ----
  // Style the message box as a success message.
  output.className = "output success";
  // Show the secret, personalized with the user's full name, using innerHTML.
  output.innerHTML = "\uD83D\uDD13 Access granted, " + fullName + "!<br><br>" +
                     "Here is the secret: the vault was never the point. " +
                     "The habit of showing up and doing the work is what actually pays off.";

  // Return false so the form does not reload the page after we show the secret.
  return false;
}
