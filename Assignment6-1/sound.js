// Name: Larry Douglas
// CSC102 - Assignment 6.1: Incorporate Sound
// This file holds all of my JavaScript so there are none in my HTML file.

// How many bars I want in my meter
var barCount = 12;

// Keeps track of how many seconds the sound has been playing
var secondsPlaying = 0;

// Gets my audio element from the HTML page
var sound = document.getElementById("backgroundSound");

// Gets the box where the bars go
var meter = document.getElementById("meter");

// Gets the button so I can change what it says
var button = document.getElementById("powerButton");

// Gets the spot where the timer shows
var timer = document.getElementById("timer");

// Gets the spot where my messages show
var message = document.getElementById("message");


// This function draws the bars inside the meter box.
// It takes the number of bars I want and returns how many it made.
function makeBars(howMany) {

    // Starts with an empty string to build the bars in
    var bars = "";

    // Loops one time for every bar I asked for
    for (var i = 0; i < howMany; i++) {

        // Adds one bar to the string each time through the loop
        bars = bars + "<div class='bar'></div>";
    }

    // Puts all of the bars into the meter box on the page
    meter.innerHTML = bars;

    // Sends back how many bars were made
    return howMany;
}


// This function picks a random height for a bar.
// It takes a low number and a high number and returns a number in between.
function randomHeight(low, high) {

    // Picks a random number between the low and high numbers
    var height = Math.random() * (high - low) + low;

    // Sends that number back
    return height;
}


// This function turns seconds into a clock like 01:25.
// It takes the seconds and returns the text to show.
function formatTime(totalSeconds) {

    // Cuts off anything after the decimal point
    var whole = Math.floor(totalSeconds);

    // Figures out how many whole minutes there are
    var minutes = Math.floor(whole / 60);

    // Figures out the seconds that are left over
    var seconds = whole % 60;

    // Adds a zero in front of the minutes if it is only one digit
    if (minutes < 10) {

        // Puts the zero on the front
        minutes = "0" + minutes;
    }

    // Adds a zero in front of the seconds if it is only one digit
    if (seconds < 10) {

        // Puts the zero on the front
        seconds = "0" + seconds;
    }

    // Sends back the two parts with a colon in the middle
    return minutes + ":" + seconds;
}


// This function runs over and over to move the bars and update the timer.
function updateMeter() {

    // Gets all of the bars that are on the page right now
    var bars = document.getElementsByClassName("bar");

    // Goes through every bar one at a time
    for (var i = 0; i < bars.length; i++) {

        // Checks if the sound is playing right now
        if (sound.paused === false) {

            // Gives the bar a new random height so it looks like it is moving
            bars[i].style.height = randomHeight(15, 100) + "%";

        } else {

            // The sound is off, so the bar drops down to the bottom
            bars[i].style.height = "5%";
        }
    }

    // Only counts the time when the sound is actually playing
    if (sound.paused === false) {

        // Adds on the two tenths of a second that just went by
        secondsPlaying = secondsPlaying + 0.2;

        // Shows the new time on the page
        timer.innerHTML = formatTime(secondsPlaying);
    }
}


// This function turns the sound on and off when the button is clicked.
function toggleSound() {

    // Checks if the sound is stopped right now
    if (sound.paused === true) {

        // Starts the sound playing
        sound.play();

        // Changes the button so it now says to turn the sound off
        button.innerHTML = "Turn sound off";

        // Tells the user the sound is running
        message.innerHTML = "The hum is playing.";

    } else {

        // The sound was playing, so stop it
        sound.pause();

        // Changes the button back to say turn the sound on
        button.innerHTML = "Turn sound on";

        // Tells the user the sound stopped
        message.innerHTML = "The sound is off right now.";
    }
}


// This function changes how loud the sound is.
// It takes the number from the slider and returns the volume it set.
function changeVolume(sliderNumber) {

    // The slider gives me text, so I turn it into a number
    var number = Number(sliderNumber);

    // My audio element needs a number between 0 and 1, so I divide by 100
    var volume = number / 100;

    // Sets the new volume on the sound
    sound.volume = volume;

    // Warns the user if they turned the volume all the way down
    if (number === 0) {

        // Explains why they cannot hear anything
        message.innerHTML = "The volume is turned all the way down.";
    }

    // Sends the volume back
    return volume;
}


// This function runs one time when the page finishes loading.
function startPage() {

    // Draws the bars into the meter box
    makeBars(barCount);

    // Sets the starting volume to 50 percent to match the slider
    changeVolume(50);

    // Replaces the waiting text now that this file has loaded
    message.innerHTML = "The sound is off right now.";

    // Runs my updateMeter function every 200 milliseconds
    setInterval(updateMeter, 200);
}


// Runs my startPage function as soon as the page loads
window.onload = startPage;
