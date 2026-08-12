/* ============================================================
   script.js - EXTERNAL JavaScript for the GrantFlowHQ table page
   CSC102 - Table Assignment
   Author: Larry Douglas

   No JavaScript is written inside index.html and no event
   listeners are used. The <script> tag sits at the bottom of the
   body, so by the time these lines run the table already exists.
   ============================================================ */

// Grab the paragraph under the table. Until this script runs it still
// reads "Waiting for JS to load...", which is my own error check - if I
// see that message in the browser, the script never loaded.
var statusLine = document.getElementById("statusLine");

// Count the data rows by asking the tbody how many <tr> elements it holds.
// querySelector finds the first match for the CSS selector I hand it.
var tableBody = document.querySelector(".grant-table tbody");
var rowCount = tableBody.rows.length;

// Count the columns from the first header row so the number stays right
// even if I add or remove a column later.
var headerRow = document.querySelector(".grant-table thead tr");
var columnCount = headerRow.cells.length;

// Build today's date as a readable string, e.g. "August 12, 2026"
var today = new Date();
var options = { year: "numeric", month: "long", day: "numeric" };
var todayText = today.toLocaleDateString("en-US", options);

// Write the summary line. innerHTML replaces the placeholder text and
// lets me include the <strong> tags in the message.
statusLine.innerHTML =
  "Showing <strong>" + rowCount + "</strong> grant programs across <strong>" +
  columnCount + "</strong> columns. Pipeline last reviewed " + todayText + ".";
