// ============================================================
// palindrome.js
// Name: Larry Douglas
// Course: CSC102 - Introduction to Programming
// Purpose: holds every function used by palindrome.html.
//          Cleans the user's text, walks it from both ends,
//          reports the result with innerHTML, and keeps the
//          session loop running until the user says stop.
// ============================================================

// keepChecking is the switch that controls the session loop - true means still taking words
var keepChecking = true;

// wordCount keeps a running total of how many strings have been tested
var wordCount = 0;

// palindromeCount keeps a running total of how many of those were palindromes
var palindromeCount = 0;

// ------------------------------------------------------------
// cleanText() strips out spaces, punctuation, and capital letters
// so that "Never odd or even" is compared as "neveroddoreven"
// ------------------------------------------------------------
function cleanText(rawText) {

    // cleaned starts out empty and gets built one character at a time
    var cleaned = "";

    // loop across every character position in the text the user typed
    for (var i = 0; i < rawText.length; i = i + 1) {

        // pull out the single character sitting at this position and force it to lowercase
        var oneChar = rawText.charAt(i).toLowerCase();

        // keep the character only if it is a letter a-z or a digit 0-9
        if ((oneChar >= "a" && oneChar <= "z") || (oneChar >= "0" && oneChar <= "9")) {

            // add the approved character onto the end of the cleaned string
            cleaned = cleaned + oneChar;
        }
    }

    // hand the cleaned-up string back to whoever called this function
    return cleaned;
}

// ------------------------------------------------------------
// isPalindrome() walks the cleaned string from both ends toward
// the middle and returns true only if every pair matches
// ------------------------------------------------------------
function isPalindrome(cleanedText) {

    // left starts at the very first character
    var left = 0;

    // right starts at the very last character
    var right = cleanedText.length - 1;

    // keep stepping inward until the two markers meet in the middle
    while (left < right) {

        // if the two characters facing each other are different, it cannot be a palindrome
        if (cleanedText.charAt(left) !== cleanedText.charAt(right)) {

            // stop right here and report back false
            return false;
        }

        // move the left marker one step to the right
        left = left + 1;

        // move the right marker one step to the left
        right = right - 1;
    }

    // every pair matched, so the string is a palindrome
    return true;
}

// ------------------------------------------------------------
// buildTiles() returns the HTML for a row of letter tiles, with
// each letter marked gold if its mirror partner matches
// ------------------------------------------------------------
function buildTiles(cleanedText) {

    // start the row of tiles
    var tileHTML = "<div class='strip'>";

    // loop across every character in the cleaned string
    for (var i = 0; i < cleanedText.length; i = i + 1) {

        // find the character sitting in the mirror position on the other end
        var mirrorChar = cleanedText.charAt(cleanedText.length - 1 - i);

        // decide which class this tile gets based on whether the pair matches
        var tileClass = "tile match";

        // if the character and its mirror partner are different, mark the tile as a break
        if (cleanedText.charAt(i) !== mirrorChar) {

            // this is where the pattern breaks, so use the red styling instead
            tileClass = "tile break";
        }

        // add this one tile onto the row
        tileHTML = tileHTML + "<span class='" + tileClass + "'>" + cleanedText.charAt(i) + "</span>";
    }

    // close the row of tiles
    tileHTML = tileHTML + "</div>";

    // hand the finished HTML back so it can be dropped into the message box
    return tileHTML;
}

// ------------------------------------------------------------
// checkWord() runs when the user submits the word form. It
// validates the input, checks the word, and prints the result.
// ------------------------------------------------------------
function checkWord() {

    // grab the message box once so it can be reused below
    var messageBox = document.getElementById("messageBox");

    // if the user already exited the loop, do nothing at all
    if (keepChecking === false) {

        // returning false stops the browser from reloading the page
        return false;
    }

    // read whatever the user typed into the text box
    var rawText = document.getElementById("userText").value;

    // VALIDATION 1 - catch an empty box or a box holding nothing but spaces
    if (rawText.trim() === "") {

        // write the warning into the page with innerHTML instead of an alert
        messageBox.innerHTML = "<p class='warn'>The box is empty. Type a word or phrase first.</p>";

        // stop here so nothing gets counted
        return false;
    }

    // clean the text down to just letters and digits
    var cleanedText = cleanText(rawText);

    // VALIDATION 2 - catch input that had no letters or digits at all, like "!!!"
    if (cleanedText === "") {

        // tell the user what the page can actually work with
        messageBox.innerHTML = "<p class='warn'>I need at least one letter or number to check.</p>";

        // stop here so nothing gets counted
        return false;
    }

    // this entry counts as a real check, so add it to the running total
    wordCount = wordCount + 1;

    // run the actual forward-and-backward comparison
    var result = isPalindrome(cleanedText);

    // start building the message with the tile row that shows the letters
    var messageHTML = buildTiles(cleanedText);

    // if the check came back true, print the success message
    if (result === true) {

        // add this one to the palindrome total
        palindromeCount = palindromeCount + 1;

        // green line confirming the match, showing the user's original text
        messageHTML = messageHTML + "<p class='yes'>Yes - \"" + rawText + "\" is a palindrome.</p>";

    } else {

        // amber line for a string that does not read the same both ways
        messageHTML = messageHTML + "<p class='no'>No - \"" + rawText + "\" is not a palindrome.</p>";
    }

    // add the small gray line showing exactly what was compared after cleaning
    messageHTML = messageHTML + "<p class='detail'>Compared as: " + cleanedText + " &bull; checked " + wordCount + " so far</p>";

    // write the whole message into the page with innerHTML
    messageBox.innerHTML = messageHTML;

    // switch on the yes/no question so the user can keep going or exit
    document.getElementById("againBox").style.display = "block";

    // returning false keeps the form from reloading the page
    return false;
}

// ------------------------------------------------------------
// answerAgain() runs when the user submits the yes/no form and
// either loops back for another word or exits the loop
// ------------------------------------------------------------
function answerAgain() {

    // collect both radio buttons so their values can be read
    var choices = document.forms["againForm"]["again"];

    // answer holds whichever option the user selected
    var answer = "yes";

    // loop through the radio buttons to find the one that is checked
    for (var i = 0; i < choices.length; i = i + 1) {

        // when the checked button is found, save its value
        if (choices[i].checked === true) {

            // store the selected value for the decision below
            answer = choices[i].value;
        }
    }

    // if the user wants to keep going, reset the form for the next word
    if (answer === "yes") {

        // empty the text box so the old word is not sitting there
        document.getElementById("userText").value = "";

        // put the cursor back in the text box so the user can just start typing
        document.getElementById("userText").focus();

        // hide the question again until the next result comes in
        document.getElementById("againBox").style.display = "none";

    } else {

        // the user is done, so flip the switch that ends the session loop
        keepChecking = false;

        // hide the yes/no question for good
        document.getElementById("againBox").style.display = "none";

        // lock the text box so no more words can be entered
        document.getElementById("userText").disabled = true;

        // gray out the check button to show the loop has ended
        document.getElementById("checkButton").disabled = true;

        // write the closing summary with the running totals
        document.getElementById("messageBox").innerHTML =
            "<div class='summary'>Session closed. You checked " + wordCount +
            " entries and " + palindromeCount + " of them were palindromes." +
            "<p class='detail'>Refresh the page to start a new session.</p></div>";
    }

    // returning false keeps the form from reloading the page
    return false;
}
