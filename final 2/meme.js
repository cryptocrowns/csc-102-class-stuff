/* ============================================================
   meme.js - EXTERNAL JavaScript for meme.html
   CSC102 Final Project: A Web Presence
   Author: Larry Douglas

   Holds the three memes in an array of objects - a collection of
   composite values - and writes the chosen one into the page with
   innerHTML. No alerts, no addEventListener, no script in the HTML.
   ============================================================ */

// --- The collection -------------------------------------------------
// An array of objects. Each object bundles three related strings, so
// the file name and its caption can never drift apart.
var memes = [
  {
    file: "meme1.png",
    title: "It works on my laptop",
    caption: "Green check here, red X everywhere else. Every deploy, without fail.",
    alt: "A laptop with a green check next to a server with a red X."
  },
  {
    file: "meme2.png",
    title: "Due Monday by 2:59 AM",
    caption: "Two minutes of margin is still margin.",
    alt: "A clock reading just before three o'clock."
  },
  {
    file: "meme3.png",
    title: "Thirty years chasing faults",
    caption: "Same job, smaller wires. And it is always a missing semicolon.",
    alt: "A junction box with one loose sparking wire."
  }
];

// --- Elements this page works with ----------------------------------
var memeForm = document.getElementById("memeForm");
var featuredBox = document.getElementById("featuredMeme");

// Clear the placeholder now that the script has run.
// memes.length reads the size of the collection instead of hard coding 3.
featuredBox.className = "message msg-hint";
featuredBox.innerHTML = "Pick one of the " + memes.length + " memes above to see it full size.";


/* showMeme()
   Runs on form submit. Pulls the chosen meme out of the array by its
   index and writes it into the page. Returns false so the page stays put. */
function showMeme() {

  // The select gives back a string, so Number() turns "1" into 1
  var picked = document.getElementById("memePick").value;

  // Guard clause: the placeholder option carries an empty value
  if (picked === "") {
    featuredBox.className = "message msg-hint";
    featuredBox.innerHTML = "Pick a meme from the list first.";
    return false;
  }

  var index = Number(picked);

  // Read one object out of the collection, then read its properties
  var meme = memes[index];

  featuredBox.className = "message msg-pass";
  featuredBox.innerHTML =
    "<strong>" + meme.title + "</strong><br>" +
    "<img src=\"" + meme.file + "\" alt=\"" + meme.alt + "\"><br>" +
    meme.caption;

  return false;
}

// Assign the handler here in the external file
memeForm.onsubmit = showMeme;
