/* ============================================================
   validate.js - EXTERNAL JavaScript for validate.html
   CSC102 Final Project: A Web Presence
   Author: Larry Douglas

   Validates four form fields and reports the result with
   innerHTML. No alerts, no addEventListener, and no JavaScript
   written inside the HTML file.
   ============================================================ */

// The form and the box its messages get written into
var applicationForm = document.getElementById("applicationForm");
var formResult = document.getElementById("formResult");

// Clear the placeholder so I know the file loaded
formResult.innerHTML = "Fill in all four fields, then press Submit application.";


/* validateApplication()
   Checks every field, collects the problems, and reports back.
   Returns false so the page never reloads and wipes the message. */
function validateApplication() {

  // Read all four values. Every .value comes back as a string.
  var businessName = document.getElementById("businessName").value;
  var email = document.getElementById("email").value;
  var requestAmount = document.getElementById("requestAmount").value;
  var grantType = document.getElementById("grantType").value;

  // Array collects every problem found, so the user sees all of them at
  // once instead of fixing one and discovering another
  var problems = [];

  // --- Check 1: business name --------------------------------------
  // trim() drops leading and trailing spaces so a field of spaces fails
  if (businessName.trim().length < 2) {
    problems.push("Business name needs at least 2 characters.");
  }

  // --- Check 2: email ----------------------------------------------
  // indexOf returns the position of the character, or -1 if it is absent.
  // The dot has to come after the @, which is why the positions get compared.
  var atPosition = email.indexOf("@");
  var dotPosition = email.lastIndexOf(".");
  if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition === email.length - 1) {
    problems.push("Email needs an @ with text on both sides and a dot after the @.");
  }

  // --- Check 3: amount ---------------------------------------------
  // Number() turns the string into a number, or into NaN if it cannot.
  var amount = Number(requestAmount);
  if (requestAmount.trim() === "" || isNaN(amount)) {
    problems.push("Amount must be a number, digits only.");
  } else if (amount % 1 !== 0) {
    // The remainder of a whole number divided by 1 is always 0
    problems.push("Amount must be whole dollars, no cents.");
  } else if (amount < 1000 || amount > 1000000) {
    problems.push("Amount must be between 1,000 and 1,000,000.");
  }

  // --- Check 4: grant type -----------------------------------------
  // The placeholder option carries an empty value, so this catches it
  if (grantType === "") {
    problems.push("Pick a grant type from the list.");
  }

  // --- Report ------------------------------------------------------
  if (problems.length > 0) {

    // Build a bulleted list of every problem found
    var listItems = "";
    for (var i = 0; i < problems.length; i = i + 1) {
      listItems = listItems + "<li>" + problems[i] + "</li>";
    }

    formResult.className = "message msg-fail";
    formResult.innerHTML =
      "<strong>Not submitted. " + problems.length +
      " thing(s) to fix:</strong><ul>" + listItems + "</ul>";

  } else {

    // Everything passed. toLocaleString puts the commas back in the number.
    formResult.className = "message msg-pass";
    formResult.innerHTML =
      "<strong>Application accepted.</strong><br>" +
      "Business: " + businessName + "<br>" +
      "Email: " + email + "<br>" +
      "Requesting: $" + amount.toLocaleString("en-US") + "<br>" +
      "Program: " + grantType;
  }

  // Cancel the browser's own submit so the result stays on screen
  return false;
}

// Assign the handler in this external file - not an event listener,
// and not an onsubmit attribute written into the HTML
applicationForm.onsubmit = validateApplication;
