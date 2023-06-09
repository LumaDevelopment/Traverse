/* ---------- ON INSTALL LISTENER ---------- */

// When the extension is first installed, we want to initialize
// our range with two dates: so we'll just set it to today.
chrome.runtime.onInstalled.addListener((reason) => {

    // https://stackoverflow.com/a/29774197
    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().split('T')[0];

    chrome.storage.sync.set({"startDate": todaysDate});
    chrome.storage.sync.set({"endDate": todaysDate});

});

/* ---------- NAVIGATE TO NEW URL LISTENER ---------- */

// Any time a tab is updated, it's time to add one to the counter
chrome.tabs.onUpdated.addListener(() => {

    /*
    I initially thought of storing every timestamp in which the
    URL changed, which would allow insanely precise time/date
    ranges. The problem is, I ran the numbers, and that takes up
    A LOT of data. So, if we just stick to dates, we can use
    dates as our key, which means every new day is only minor
    mounts of additional data expended.
     */

    let todaysDate = new Date();

    // Same format that we get from the date picker input
    todaysDate = todaysDate.toISOString().split('T')[0];

    let storage = chrome.storage.sync;

    storage.get(todaysDate, function (result) {

        let foundEntry = false;

        for (let [key, val] of Object.entries(result)) {

            foundEntry = true;

            // Just increase URL count by 1
            let newVal = val + 1;

            // Dynamic storage key shenanigans. Apparently
            // there's a new, improved, better way to do
            // this, but I gave it a shot, and it didn't work,
            // so I'm just going to stick to this.
            let obj = {};
            obj[todaysDate] = newVal;

            // Set our new value!
            storage.set(obj);

        }

        if (!foundEntry) {

            // If we don't already have a value for
            // this date, let's initialize it.

            let obj = {};
            obj[todaysDate] = 1;

            storage.set(obj);

        }

    });

});