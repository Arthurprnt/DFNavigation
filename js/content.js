let url = document.URL;
let domain = url.split("//")[1].split("/")[0];
let run_clock = false;
let date = new Date().getDate();

chrome.storage.local.get().then((result) => {
    for(i=0; i<result.dfn_blocked.length; i+=1) {
        if([result.dfn_blocked[i], `www.${result.dfn_blocked[i]}`, result.dfn_blocked[i].replace("www.", "")].includes(domain)) {
            console.log("The page will be blocked soon...");
            window.stop();
            (async () => {
                const response = await chrome.runtime.sendMessage({message: "blockedTab"});
                console.log(response);
              })();
    
        }
    }
    for(i=0; i<result.dfn_limited.length; i+=1) {
        if([result.dfn_limited[i], `www.${result.dfn_limited[i]}`, result.dfn_limited[i].replace("www.", "")].includes(domain)) {
            run_clock = true;
        }
    }
    if(result.dfn_last_connection != date) {
        chrome.storage.local.set({dfn_last_connection: date, dfn_day_time: 0}).then(() => {
            console.log(`Saved last connection to today and saved the time to 0`);
        });
    } else if(run_clock) {
        let tt = result.dfn_timer;
        if(tt >= tt[0]*3600+tt[1]*60+tt[2]*1) {
            console.log("The page will be blocked soon...");
            window.stop();
            (async () => {
                const response = await chrome.runtime.sendMessage({message: "limitedTab"});
                console.log(response);
            })();
        }
    }
});

var horloge = setInterval(function() {
    if(run_clock) {
        chrome.storage.local.get().then((result) => {
            let time = result.dfn_day_time + 5;
            let tt = result.dfn_timer;
            chrome.storage.local.set({dfn_day_time: time}).then(() => {
                console.log(`Saved time to ${time}/${tt[0]*3600+tt[1]*60+tt[2]*1}`);
                if(time >= tt[0]*3600+tt[1]*60+tt[2]*1) {
                    console.log("The page will be blocked soon...");
                    window.stop();
                    (async () => {
                        const response = await chrome.runtime.sendMessage({message: "limitedTab"});
                        console.log(response);
                    })();
                }
            });
        });
    }
}, 5000);