/* ============================================================
   game.js - EXTERNAL JavaScript for game.html
   CSC102 Final Project: A Web Presence
   Author: Larry Douglas

   Number guessing game. Six tries to find a hidden number from
   1 to 100. All feedback goes in with innerHTML, plus a sound.
   No alerts, no addEventListener, no script inside the HTML.
   ============================================================ */

// --- Elements this page works with ---------------------------------
var guessForm = document.getElementById("guessForm");
var gameResult = document.getElementById("gameResult");
var triesLeftBox = document.getElementById("triesLeft");
var lastGuessBox = document.getElementById("lastGuess");
var rangeLeftBox = document.getElementById("rangeLeft");

// --- Game state ----------------------------------------------------
// Math.random() gives a decimal from 0 up to (not including) 1.
// Times 100 and floored gives 0-99, so adding 1 gives 1-100.
var secretNumber = Math.floor(Math.random() * 100) + 1;
var triesLeft = 6;          // number - how many guesses remain
var lowEdge = 1;            // number - lowest value still possible
var highEdge = 100;         // number - highest value still possible
var gameOver = false;       // Boolean - locks the form once the game ends

// --- Sound files ---------------------------------------------------
// Both WAV files ship with the project, so nothing loads from the web
var correctSound = new Audio("correct.wav");
var wrongSound = new Audio("wrong.wav");

// Clear the placeholder now that the script has run
gameResult.className = "message msg-hint";
gameResult.innerHTML = "Six guesses. Start anywhere - 50 splits the range in half.";


/* playSound()
   Plays a sound and swallows the error if the browser blocks audio
   before the user has interacted with the page. */
function playSound(sound) {
  sound.currentTime = 0;   // rewind so quick repeat guesses still play
  var attempt = sound.play();
  if (attempt !== undefined) {
    // catch keeps a blocked autoplay from stopping the rest of the game
    attempt.catch(function () { });
  }
}


/* updateScoreboard()
   Rewrites the three stat boxes above the form. */
function updateScoreboard(guess) {
  triesLeftBox.innerHTML = triesLeft;
  lastGuessBox.innerHTML = guess;
  rangeLeftBox.innerHTML = lowEdge + "-" + highEdge;
}


/* makeGuess()
   Runs on form submit. Returns false so the page never reloads. */
function makeGuess() {

  // The game is finished - tell them to start a new one and stop here
  if (gameOver) {
    gameResult.className = "message msg-hint";
    gameResult.innerHTML = "This game is over. Press <strong>New game</strong> to play again.";
    return false;
  }

  // Read the typed value and turn it into a number
  var typed = document.getElementById("guessInput").value;
  var guess = Number(typed);

  // --- Validate before spending one of the six guesses --------------
  if (typed.trim() === "" || isNaN(guess) || guess % 1 !== 0) {
    gameResult.className = "message msg-fail";
    gameResult.innerHTML = "Whole numbers only. That guess did not count.";
    return false;
  }

  if (guess < 1 || guess > 100) {
    gameResult.className = "message msg-fail";
    gameResult.innerHTML = "Stay between 1 and 100. That guess did not count.";
    return false;
  }

  // The guess is valid, so it costs a try
  triesLeft = triesLeft - 1;

  // --- Right answer -------------------------------------------------
  if (guess === secretNumber) {
    gameOver = true;
    updateScoreboard(guess);
    playSound(correctSound);
    gameResult.className = "message msg-pass";
    gameResult.innerHTML =
      "<strong>Got it.</strong> The award was $" + (secretNumber * 1000).toLocaleString("en-US") +
      ", found with " + triesLeft + " guess(es) to spare.";
    return false;
  }

  // --- Wrong answer, out of tries ------------------------------------
  if (triesLeft === 0) {
    gameOver = true;
    updateScoreboard(guess);
    playSound(wrongSound);
    gameResult.className = "message msg-fail";
    gameResult.innerHTML =
      "<strong>Out of guesses.</strong> The award was $" +
      (secretNumber * 1000).toLocaleString("en-US") + ". Press New game to try again.";
    return false;
  }

  // --- Wrong answer, tries remain -------------------------------------
  // Narrow the range so the scoreboard shows what is still possible
  var direction;
  if (guess < secretNumber) {
    direction = "higher";
    if (guess >= lowEdge) {
      lowEdge = guess + 1;
    }
  } else {
    direction = "lower";
    if (guess <= highEdge) {
      highEdge = guess - 1;
    }
  }

  // Math.abs drops the minus sign, so the distance is always positive
  var distance = Math.abs(guess - secretNumber);
  var warmth;
  if (distance <= 3) {
    warmth = "Red hot.";
  } else if (distance <= 10) {
    warmth = "Warm.";
  } else if (distance <= 25) {
    warmth = "Cool.";
  } else {
    warmth = "Ice cold.";
  }

  updateScoreboard(guess);
  playSound(wrongSound);
  gameResult.className = "message msg-hint";
  gameResult.innerHTML =
    "<strong>Go " + direction + ".</strong> " + warmth + " " +
    triesLeft + " guess(es) left, and it is somewhere in " + lowEdge + "-" + highEdge + ".";

  return false;
}

// Assign the handler here in the external file
guessForm.onsubmit = makeGuess;
