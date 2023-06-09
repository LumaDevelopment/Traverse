/* ---------- GO BACK BUTTON ---------- */

// First order of business, make sure you can get out of this place!
let goBack = document.getElementById("goBack");

goBack.addEventListener("click", async () => {
    window.location.href = "popup_main.html";
});

/* ---------- CHANGE RANGE BUTTON ---------- */

let changeRangeButton = document.getElementById("changeRangeButton");
const startDate = document.querySelector('input[name="datePicker1"]');
const endDate = document.querySelector('input[name="datePicker2"]');

changeRangeButton.addEventListener("click", async () => {

    // If either date picker not set
    if (startDate.value === '' || endDate.value === '') {

        // Fade the button into red
        $("#changeRangeButton").animate({
            backgroundColor: "#ff0f17"
        }, 200);

        // Shake the button, to indicate WRONG
        $("#changeRangeButton").shake({
            distance: 10,
            duration: 400,
            horizontal: true
        });

        // slowly fade the button back to its normal color
        setTimeout(() => {
            $("#changeRangeButton").animate({
                backgroundColor: "#fbbc02"
            }, 600);
        }, 1000);

    } else {

        // set the new range
        setNewRange(startDate.value, endDate.value);

        // fade the button into a nice success color
        $("#changeRangeButton").animate({
            backgroundColor: "#42E529"
        }, 200);

        // fade the button back to its normal color
        setTimeout(() => {
            $("#changeRangeButton").animate({
                backgroundColor: "#fbbc02"
            }, 600);
        }, 1000);

    }

});

/* ---------- UTILITY FUNCTIONS ---------- */

/**
 * Utility function needed for the changeRangeButton.
 * Originally I had this in a separate file, but turns out
 * you really can't move too many functions to separate files
 * that deal with Chrome storage (while you can, it just
 * gets tricky due to Chrome storage's asynchronous nature)
 *
 * @param startDate The start date of the new range to set
 * @param endDate The end date of the new range to set
 */
function setNewRange(startDate, endDate) {
    chrome.storage.sync.set({"startDate": startDate});
    chrome.storage.sync.set({"endDate": endDate});
}