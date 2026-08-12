/* ============================================================
   table.js - EXTERNAL JavaScript for table.html
   CSC102 Final Project: A Web Presence
   Author: Larry Douglas

   Counts the rows and columns in the grant table and stamps a
   summary line under it. No event listeners are used - the script
   tag sits at the bottom of the body, so the table already exists
   by the time these lines run.
   ============================================================ */

// The paragraph under the table. Until this runs it still reads
// "Waiting for JS to load...", which is my own check that the file loaded.
var statusLine = document.getElementById("statusLine");

// Count the data rows by asking the tbody how many rows it holds
var tableBody = document.querySelector(".grant-table tbody");
var rowCount = tableBody.rows.length;

// Count the columns off the header row, so the number stays correct
// even if I add or remove a column later
var headerRow = document.querySelector(".grant-table thead tr");
var columnCount = headerRow.cells.length;

// Build today's date as a readable string, e.g. "August 12, 2026"
var today = new Date();
var dateOptions = { year: "numeric", month: "long", day: "numeric" };
var todayText = today.toLocaleDateString("en-US", dateOptions);

// innerHTML replaces the placeholder and lets me include the <strong> tags
statusLine.innerHTML =
  "Showing <strong>" + rowCount + "</strong> grant programs across <strong>" +
  columnCount + "</strong> columns. Pipeline last reviewed " + todayText + ".";
