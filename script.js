/* ==========================================================
   Larry Douglas - CSC102 - Bringing It All Together
   script.js - all JavaScript for the GrantFlowHQ page

   Concepts demonstrated in this file:
     1. Decision logic  - if / else if / else in the validation and matching code
     2. Loops           - for loops over the grant catalog and over code characters
     3. Strings         - trimming, case changes, regex validation, reversing
     4. Functions       - every job on this page lives in its own named function
     5. Classes         - the Grant class below
     6. Objects         - the applicant object and the report objects
   ========================================================== */

/* ----------------------------------------------------------
   1. CLASS - one blueprint that every grant in the catalog is built from
   ---------------------------------------------------------- */

// Blueprint describing a single grant program
class Grant {
  // Constructor runs once for each grant I create and stores its details
  constructor(name, agency, award, minimumYears, veteranOnly) {
    // Name of the grant program
    this.name = name;
    // Agency or organization funding the grant
    this.agency = agency;
    // Award amount as a display string
    this.award = award;
    // Smallest number of years in business the program accepts
    this.minimumYears = minimumYears;
    // True when the program is set aside for veteran-owned businesses
    this.veteranOnly = veteranOnly;
  }

  // Method that compares one applicant to this grant and reports back
  evaluate(applicant) {
    // Start a list that will hold one plain-English line per rule checked
    const notes = [];
    // Counter for how many of this grant's rules the applicant passed
    let passedRules = 0;

    // Decision logic: does the applicant meet the years-in-business rule?
    if (applicant.years >= this.minimumYears) {
      // Count the rule as passed
      passedRules = passedRules + 1;
      // Record the reason so the user can see why they matched
      notes.push("Meets the " + this.minimumYears + "-year minimum");
    } else {
      // Record the shortfall so the user knows what is missing
      notes.push("Needs " + this.minimumYears + " years in business");
    }

    // Decision logic: does the applicant meet the veteran ownership rule?
    if (this.veteranOnly === false) {
      // The grant is open to everyone, so this rule always passes
      passedRules = passedRules + 1;
      // Record that ownership status does not matter here
      notes.push("Open to all small businesses");
    } else if (applicant.isVeteranOwned === true) {
      // The grant is veteran-only and the applicant qualifies
      passedRules = passedRules + 1;
      // Record the match
      notes.push("Veteran-owned set-aside met");
    } else {
      // The grant is veteran-only and the applicant does not qualify
      notes.push("Reserved for veteran-owned businesses");
    }

    // Return an object holding the whole result for this one grant
    return {
      // Carry the grant itself along so the caller can print its details
      grant: this,
      // How many of the two rules were satisfied
      passedRules: passedRules,
      // The applicant is eligible only when both rules passed
      isEligible: passedRules === 2,
      // The explanation lines gathered above
      notes: notes
    };
  }
}

/* ----------------------------------------------------------
   2. OBJECTS - the catalog of grants this tool searches
   ---------------------------------------------------------- */

// Array of Grant objects, each one built from the class above
const grantCatalog = [
  // A federal program open to any small business
  new Grant("Small Business Innovation Grant", "SBA", "$25,000", 1, false),
  // A veteran-focused program with a low time-in-business bar
  new Grant("Veteran Entrepreneur Fund", "VA Office of Small Business", "$15,000", 0, true),
  // A community program aimed at established local employers
  new Grant("Main Street Growth Award", "County Economic Development", "$10,000", 3, false),
  // A larger veteran program that expects a longer track record
  new Grant("Service to Business Expansion Grant", "Veteran Business Alliance", "$50,000", 5, true),
  // A startup program with no time requirement at all
  new Grant("First Year Startup Boost", "State Commerce Office", "$5,000", 0, false)
];

/* ----------------------------------------------------------
   3. STRING HELPER FUNCTIONS
   ---------------------------------------------------------- */

// Function that strips characters browsers treat as HTML so user text prints safely
function makeTextSafe(rawText) {
  // Replace each risky character with its harmless HTML entity and hand the result back
  return rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Function that reverses a string one character at a time using a loop
function reverseText(text) {
  // Start with an empty string that the loop will fill in backwards
  let reversed = "";
  // Loop from the last character down to the first
  for (let i = text.length - 1; i >= 0; i = i - 1) {
    // Add the current character onto the end of the reversed string
    reversed = reversed + text.charAt(i);
  }
  // Send the finished reversed string back to the caller
  return reversed;
}

// Function that decides whether a tracking code reads the same in both directions
function isMirrorCode(code) {
  // Force the code to uppercase so case differences do not matter
  const upperCode = code.toUpperCase();
  // Build the backwards version using the helper above
  const backwardsCode = reverseText(upperCode);
  // Return true only when the two versions match exactly
  return upperCode === backwardsCode;
}

/* ----------------------------------------------------------
   4. VALIDATION FUNCTIONS - each one returns an error string, or "" when valid
   ---------------------------------------------------------- */

// Function that checks the business name the user typed
function checkBusinessName(name) {
  // Decision logic: nothing was entered
  if (name.length === 0) {
    // Report the empty field
    return "Enter your business name.";
  } else if (name.length < 2 || name.length > 40) {
    // Report a name that is too short or too long
    return "Business name must be 2 to 40 characters.";
  } else if (/^[A-Za-z0-9 &'.\-]+$/.test(name) === false) {
    // Report characters the pattern does not allow
    return "Business name can only use letters, numbers, spaces, & ' - and periods.";
  }
  // No problems were found, so return an empty string
  return "";
}

// Function that checks the years-in-business value the user typed
function checkYears(yearsText) {
  // Decision logic: nothing was entered
  if (yearsText.length === 0) {
    // Report the empty field
    return "Enter how many years you have been in business.";
  } else if (/^[0-9]+$/.test(yearsText) === false) {
    // Report anything that is not made of digits only
    return "Years in business must be a whole number, digits only.";
  } else if (Number(yearsText) > 100) {
    // Report a value that is out of the sensible range
    return "Years in business must be 100 or less.";
  }
  // The value passed every rule
  return "";
}

// Function that checks the veteran ownership dropdown
function checkVeteranChoice(choice) {
  // Decision logic: the user left the default option selected
  if (choice === "") {
    // Report that a choice is required
    return "Select whether your business is veteran-owned.";
  }
  // A real choice was made
  return "";
}

// Function that checks the tracking code the user typed
function checkTrackingCode(code) {
  // Decision logic: nothing was entered
  if (code.length === 0) {
    // Report the empty field
    return "Enter a tracking code.";
  } else if (code.length < 3 || code.length > 12) {
    // Report a code outside the allowed length
    return "Tracking code must be 3 to 12 characters.";
  } else if (/^[A-Za-z0-9]+$/.test(code) === false) {
    // Report a code containing anything other than letters and numbers
    return "Tracking code can only contain letters and numbers.";
  }
  // The code passed every rule
  return "";
}

/* ----------------------------------------------------------
   5. DISPLAY FUNCTIONS - these write into the page with innerHTML
   ---------------------------------------------------------- */

// Function that prints a list of validation errors into the message area
function showErrors(errorList) {
  // Start the block that will hold the error heading and list
  let html = '<div class="message error"><p class="message-title">Fix these before continuing</p><ul>';
  // Loop through every error message that was collected
  for (let i = 0; i < errorList.length; i = i + 1) {
    // Add one list item per error
    html += "<li>" + errorList[i] + "</li>";
  }
  // Close the list and the block
  html += "</ul></div>";
  // Write the finished block into the page
  document.getElementById("messageArea").innerHTML = html;
}

// Function that prints the success message naming the business that was checked
function showSuccess(applicant, matchCount) {
  // Build the confirmation sentence, with the business name made safe for printing
  const html =
    '<div class="message success">' +
    '<p class="message-title">Search complete</p>' +
    "<p>" + makeTextSafe(applicant.businessName) + " matched " + matchCount +
    " of " + grantCatalog.length + " programs.</p>" +
    "</div>";
  // Write the confirmation into the page
  document.getElementById("messageArea").innerHTML = html;
}

// Function that prints the mirror-code result for the tracking code
function showCodeResult(code) {
  // Store the safe, uppercase version of the code for display
  const displayCode = makeTextSafe(code.toUpperCase());
  // Variable that will hold the finished block of HTML
  let html = "";

  // Decision logic: is the code a mirror code?
  if (isMirrorCode(code) === true) {
    // Build the mirror-code message
    html =
      '<div class="code-result mirror">' +
      '<span class="code-chip">' + displayCode + "</span>" +
      "<p>Mirror code confirmed. " + displayCode +
      " reads the same forward and backward, so it is easy to read back over the phone.</p>" +
      "</div>";
  } else {
    // Build the standard-code message, showing what the code looks like reversed
    html =
      '<div class="code-result standard">' +
      '<span class="code-chip">' + displayCode + "</span>" +
      "<p>Standard code. Reversed it reads " + makeTextSafe(reverseText(code.toUpperCase())) +
      ", so it is not a mirror code.</p>" +
      "</div>";
  }

  // Write the finished block into the page
  document.getElementById("codeArea").innerHTML = html;
}

// Function that builds one card of HTML for a single evaluation report
function buildGrantCard(report) {
  // Choose the card style and status word based on whether the applicant qualified
  const cardClass = report.isEligible === true ? "grant-card eligible" : "grant-card not-eligible";
  // Text shown in the status chip on the card
  const statusText = report.isEligible === true ? "Eligible" : "Not yet";
  // Width of the match meter, one half of the bar per rule passed
  const meterWidth = (report.passedRules / 2) * 100;

  // Start the card with the grant name, agency and status chip
  let html = '<article class="' + cardClass + '">';
  html += '<div class="grant-head">';
  html += "<h3>" + report.grant.name + "</h3>";
  html += '<span class="status-chip">' + statusText + "</span>";
  html += "</div>";
  html += '<p class="agency">' + report.grant.agency + " &middot; up to " + report.grant.award + "</p>";

  // Add the match meter that fills in proportion to the rules passed
  html += '<div class="meter"><div class="meter-fill" style="width:' + meterWidth + '%"></div></div>';

  // Start the list of reasons behind the result
  html += "<ul class=\"notes\">";
  // Loop through every note the evaluate method produced
  for (let i = 0; i < report.notes.length; i = i + 1) {
    // Add one list item per note
    html += "<li>" + report.notes[i] + "</li>";
  }
  // Close the list and the card
  html += "</ul></article>";

  // Hand the finished card back to the caller
  return html;
}

// Function that runs every grant against the applicant and prints the cards
function showGrantResults(applicant) {
  // Collect the eligible cards separately so they can be printed first
  let eligibleHtml = "";
  // Collect the cards the applicant did not qualify for
  let otherHtml = "";
  // Running count of how many programs the applicant qualified for
  let matchCount = 0;

  // Loop through every grant in the catalog
  for (let i = 0; i < grantCatalog.length; i = i + 1) {
    // Ask this grant to evaluate the applicant
    const report = grantCatalog[i].evaluate(applicant);

    // Decision logic: sort the finished card into the right pile
    if (report.isEligible === true) {
      // Add the card to the eligible pile
      eligibleHtml += buildGrantCard(report);
      // Count the match
      matchCount = matchCount + 1;
    } else {
      // Add the card to the not-yet pile
      otherHtml += buildGrantCard(report);
    }
  }

  // Start the finished results block
  let html = "";
  // Decision logic: did the applicant match anything at all?
  if (matchCount > 0) {
    // Heading over the programs the applicant can apply for today
    html += '<h3 class="group-title">Apply now (' + matchCount + ")</h3>" + eligibleHtml;
  } else {
    // Message shown when nothing matched, pointing the user at what to change
    html += '<p class="placeholder">No programs match yet. The cards below show what each one is waiting on.</p>';
  }
  // Heading over the remaining programs, shown only when there are any
  if (otherHtml !== "") {
    html += '<h3 class="group-title">Not yet</h3>' + otherHtml;
  }

  // Write the finished results into the page
  document.getElementById("resultsArea").innerHTML = html;
  // Send the match count back so the success message can use it
  return matchCount;
}

/* ----------------------------------------------------------
   6. FORM HANDLER - the function the submit button ends up calling
   ---------------------------------------------------------- */

// Function that runs when the form is submitted
function handleFormSubmit(event) {
  // Stop the browser from reloading the page so the results stay on screen
  event.preventDefault();

  // Read the business name and trim the spaces off both ends
  const businessName = document.getElementById("businessName").value.trim();
  // Read the years value and trim it
  const yearsText = document.getElementById("yearsInBusiness").value.trim();
  // Read the veteran ownership choice from the dropdown
  const veteranChoice = document.getElementById("veteranOwned").value;
  // Read the tracking code and trim it
  const trackingCode = document.getElementById("trackingCode").value.trim();

  // Empty array that will collect any validation errors found below
  const errors = [];

  // Run each validation function and hold its answer
  const nameError = checkBusinessName(businessName);
  const yearsError = checkYears(yearsText);
  const veteranError = checkVeteranChoice(veteranChoice);
  const codeError = checkTrackingCode(trackingCode);

  // Decision logic: add each message to the list only when there is one
  if (nameError !== "") {
    errors.push(nameError);
  }
  if (yearsError !== "") {
    errors.push(yearsError);
  }
  if (veteranError !== "") {
    errors.push(veteranError);
  }
  if (codeError !== "") {
    errors.push(codeError);
  }

  // Decision logic: stop here and show the problems if anything failed
  if (errors.length > 0) {
    // Print the error list
    showErrors(errors);
    // Clear the mirror-code area so old results do not linger
    document.getElementById("codeArea").innerHTML = "";
    // Reset the results area to its starting message
    document.getElementById("resultsArea").innerHTML =
      '<p class="placeholder">Correct the fields above and check again.</p>';
    // Leave the function early, since there is nothing valid to check
    return;
  }

  // Build the applicant object from the values that just passed validation
  const applicant = {
    // The trimmed business name
    businessName: businessName,
    // The years value converted from text into a real number
    years: Number(yearsText),
    // True when the dropdown says yes, false otherwise
    isVeteranOwned: veteranChoice === "yes",
    // The tracking code stored in uppercase for consistency
    trackingCode: trackingCode.toUpperCase()
  };

  // Print the mirror-code result for the tracking code
  showCodeResult(applicant.trackingCode);
  // Run the catalog and print the cards, keeping the number of matches
  const matchCount = showGrantResults(applicant);
  // Print the confirmation message using that count
  showSuccess(applicant, matchCount);
}

/* ----------------------------------------------------------
   7. WIRING - connect the form's submit event to the handler above
   ---------------------------------------------------------- */

// Find the form on the page and store it
const eligibilityForm = document.getElementById("eligibilityForm");
// Assign my handler to the form's onsubmit property so it runs on every submit
eligibilityForm.onsubmit = handleFormSubmit;
