let url = document.URL;
let domain = url.split("//")[1].split("/")[0];
let run_clock_groupe = false;
let date = new Date().getDate();
let run_clock_custom = {};

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
            run_clock_groupe = true;
        }
    }
    for(key in result.dfn_custom_limited) {
        let tt = result.dfn_custom_limited[key];
        if([key, `www.${key}`, key.replace("www.", "")].includes(domain)) {
            if(result.dfn_websites_time[key] >= tt[0]*3600+tt[1]*60+tt[2]*1) {
                (async () => {
                    const response = await chrome.runtime.sendMessage({message: "limitedCustomTab"});
                    console.log(response);
                })();
            } else {
                run_clock_custom[key] = setInterval(function() {
                    chrome.storage.local.get().then((result) => {
                        let dico_timer = result.dfn_websites_time;
                        if(dico_timer[key] !== undefined) {
                            dico_timer[key] += 7;
                            if(dico_timer[key] >= tt[0]*3600+tt[1]*60+tt[2]*1) {
                                (async () => {
                                    const response = await chrome.runtime.sendMessage({message: "limitedCustomTab"});
                                    console.log(response);
                                })();
                            }
                        } else {
                            dico_timer[key] = 7;
                        }
                        chrome.storage.local.set({dfn_websites_time: dico_timer}).then(() => {
                            console.log(`Set the limit timer for ${key} to ${dico_timer[key]+7}/${tt[0]*3600+tt[1]*60+tt[2]*1}`);
                        });
                    });
                }, 7000);
            }
        }
    }
    if(result.dfn_last_connection != date) {
        let dico = {}
        for(let key in result.dfn_custom_limited) {
            dico[key] = 0;
        }
        chrome.storage.local.set({dfn_last_connection: date, dfn_day_time: 0, dfn_websites_time: dico}).then(() => {
            console.log(`Saved last connection to today and saved the time to 0`);
        });
    } else if(run_clock_groupe) {
        let tt = result.dfn_timer;
        if(result.dfn_day_time >= tt[0]*3600+tt[1]*60+tt[2]*1) {
            console.log("The page will be blocked soon...");
            window.stop();
            (async () => {
                const response = await chrome.runtime.sendMessage({message: "limitedTab"});
                console.log(response);
            })();
        }
    }
});

(async () => {
    const response = await chrome.runtime.sendMessage({message: "newPageLoad"});
    console.log(response);
})();

var horloge = setInterval(function() {
    if(run_clock_groupe) {
        (async () => {
            const response = await chrome.runtime.sendMessage({message: "runClock"});
            console.log(response);
        })();
        chrome.storage.local.get().then((result) => {
            let tt = result.dfn_timer;
            if(result.dfn_day_time >= tt[0]*3600+tt[1]*60+tt[2]*1) {
                console.log("The page will be blocked soon...");
                (async () => {
                    const response = await chrome.runtime.sendMessage({message: "limitedTab"});
                    console.log(response);
                })();
            }
        });
    }
}, 4950);