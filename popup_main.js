// Utility function to convert yyyy-mm-dd to
// a date object that I can iterate through
function getDateObjFromString(dateText) {

    let year = Number(dateText.split("-")[0]);
    let month = Number(dateText.split("-")[1]) - 1;
    let day = Number(dateText.split("-")[2]);

    return new Date(year, month, day);

}

// Chrome storage asynchronous madness
chrome.storage.sync.get(['startDate'], (sdd) => {
    chrome.storage.sync.get(['endDate'], (edd) => {

        // I swear, all the variables are there for a reason!
        let startDate = sdd.startDate;
        let endDate = edd.endDate;

        let dateOneText = document.getElementById("date1");
        let dateTwoText = document.getElementById("date2");

        // Why not change the date text ASAP, just in case the
        // urlNum takes a little while to load.
        dateOneText.innerText = startDate;
        dateTwoText.innerText = endDate;

        let urlNum = document.getElementById("urlNum");

        let upperBoundDate = getDateObjFromString(endDate);
        let datesToCheck = [];

        /*
        A super neat attribute of JavaScript's Date object: you can iterate
        through it quite easily! So, we set our second date as the upper bound,
        our first date as the iteration variable, and we loop away! Funnily
        enough, we have to convert those date objects right back to the String
        format we just had to convert out of!
         */
        for (let d = getDateObjFromString(startDate); d <= upperBoundDate; d.setDate(d.getDate() + 1)) {

            let date = new Date(d);
            date = date.toISOString().split('T')[0];

            // Add date String to Array
            datesToCheck.push(date);

        }

        // Call all of our date keys at once, then do our counting, also
        // due to chrome storage asynchronous madness.
        chrome.storage.sync.get(datesToCheck, function (result) {

            let total = 0;

            for (let [key, val] of Object.entries(result)) {

                if((total + val) > Number.MAX_VALUE) {
                    total = -1;
                    break;
                }

                total += val;

            }

            if(total === -1) {

                // If the number is programmatically too big, don't show at all!
                urlNum.innerText = "Too many";

            } else if(total.toString().length > 9) {

                // If the number is too big, show it in a nicer format
                urlNum.innerText = total.toExponential(3);

            } else {

                // toLocaleString() just makes sure we can get some sweet
                // commas in the final text.

                urlNum.innerText = total.toLocaleString('en-US');

            }

        });

    });
});

// Button to bring you to popup_change_range.html
let goToChangeRange = document.getElementById("goToChangeRange");

goToChangeRange.addEventListener("click", async () => {
    window.location.href = "popup_change_range.html";
});

// QoL, sets the date range to just today
let setToToday = document.getElementById("setToToday");

setToToday.addEventListener("click", async () => {

    // https://stackoverflow.com/a/29774197
    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().split('T')[0];

    chrome.storage.sync.set({"startDate": todaysDate});
    chrome.storage.sync.set({"endDate": todaysDate});

    // Then, just follow modified steps from what
    // we did at the top of the file

    let dateOneText = document.getElementById("date1");
    let dateTwoText = document.getElementById("date2");

    dateOneText.innerText = todaysDate;
    dateTwoText.innerText = todaysDate;

    // Don't need to worry about any Date iteration.

    let urlNum = document.getElementById("urlNum");

    chrome.storage.sync.get(todaysDate, function (result) {

        let total = 0;

        // Loop, because chrome.storage is finicky and I
        // don't want to fix what isn't broken.
        for (let [key, val] of Object.entries(result)) {

            if((total + val) > Number.MAX_VALUE) {
                total = -1;
                break;
            }

            total += val;

        }

        if(total === -1) {

            // If the number is programmatically too big, don't show at all!
            urlNum.innerText = "Too many";

        } else if(total.toString().length > 9) {

            // If the number is too big, show it in a nicer format
            urlNum.innerText = total.toExponential(3);

        } else {

            // toLocaleString() just makes sure we can get some sweet
            // commas in the final text.

            urlNum.innerText = total.toLocaleString('en-US');

        }

    });

});