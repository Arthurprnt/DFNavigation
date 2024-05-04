importScripts('ExtPay.js');
var extpay = ExtPay('dfnavigation'); 
extpay.startBackground();
let run_clock = false;

chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.local.get().then((result) => {
        if(result.dfn_blocked === undefined) {
            chrome.storage.local.set({dfn_blocked: []}).then(() => {
                console.log("Initialised blocked list");
            });
        }
        if(result.dfn_limited === undefined) {
            chrome.storage.local.set({dfn_limited: []}).then(() => {
                console.log("Initialised limited list");
            });
        }
        if(result.dfn_timer === undefined) {
            chrome.storage.local.set({dfn_timer: [0, 45, 0]}).then(() => {
                console.log("Initialised timer list");
            });        
        }
        if(result.dfn_day_time === undefined) {
            chrome.storage.local.set({dfn_day_time: 0}).then(() => {
                console.log("Initialised day's timer list");
            });
        }
        if(result.dfn_last_connection === undefined) {
            let now = new Date().getDate();
            chrome.storage.local.set({dfn_last_connection: now}).then(() => {
                console.log(`Initialised last connection list to ${now}`);
            });
        }
        if(result.dfn_use_dark_mode === undefined) {
            chrome.storage.local.set({dfn_use_dark_mode: false}).then(() => {
                console.log(`Initialised dark mode use to false`);
            });        
        }
        if(result.dfn_pwd === undefined) {
            chrome.storage.local.set({dfn_pwd: ""}).then(() => {
                console.log(`Initialised password as blank`);
            });
        }
        if(result.dfn_custom_limited === undefined) {
            chrome.storage.local.set({dfn_custom_limited: {}}).then(() => {
                console.log(`Initialised list for websites with a custom time limit`);
            });
        }
        if(result.dfn_websites_time === undefined) {
            chrome.storage.local.set({dfn_websites_time: {}}).then(() => {
                console.log(`Initialised websites timers`);
            });
        }
    });
    
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "blockedTab") {
            chrome.tabs.query({ active: true }, function(tabs) {  
                chrome.tabs.remove(tabs[0].id);   
            });
            chrome.tabs.create({ url: "../html/blocked.html"});
            sendResponse({res: "sucess"});
        } else if (request.message == "limitedTab") {
            chrome.tabs.query({ active: true }, function(tabs) {
                full_url = tabs[0].url;
                domain = full_url.split("//")[1].split("/")[0];
                chrome.storage.local.get().then((result) => {
                    for(i=0; i<result.dfn_limited.length; i+=1) {
                        if([result.dfn_limited[i], `www.${result.dfn_limited[i]}`, result.dfn_limited[i].replace("www.", "")].includes(domain)) {
                            chrome.tabs.remove(tabs[0].id); 
                            chrome.tabs.create({ url: "../html/limited.html"});
                            sendResponse({res: "sucess"}); 
                        }
                    }
                }); 
            });
        } else if(request.message == "limitedCustomTab") {
            chrome.tabs.query({ active: true }, function(tabs) {
                full_url = tabs[0].url;
                domain = full_url.split("//")[1].split("/")[0];
                chrome.storage.local.get().then((result) => {
                    for(key in result.dfn_custom_limited) {
                        if([key, `www.${key}`, key.replace("www.", "")].includes(domain)) {
                            chrome.tabs.remove(tabs[0].id); 
                            chrome.tabs.create({ url: "../html/limited_premium.html"});
                            sendResponse({res: "sucess"}); 
                        }
                    }
                }); 
            });
        } else if(request.message == "runClock") {
            run_clock = true;
            sendResponse({res: "sucess"})
        } else if(request.message == "newPageLoad") {
            extpay.getUser().then(user => {
                if (!user.paid) {
                    chrome.storage.local.set({dfn_use_dark_mode: false, dfn_pwd: "", dfn_custom_limited: {}, dfn_websites_time: {}}).then(() => {
                        console.log(`Reset the premium options as the user is not subscribed`);
                        sendResponse({res: "sucess"});
                    });
                }
            }).catch(err => {
                console.log(err);
                sendResponse({res: err});
            })
            sendResponse({res: "sucess"});
        }
    }
);

var horloge = setInterval(function() {
    if(run_clock) {
        chrome.storage.local.get().then((result) => {
            let time = result.dfn_day_time + 10;
            let tt = result.dfn_timer;
            chrome.storage.local.set({dfn_day_time: time}).then(() => {
                console.log(`Saved time to ${time}/${tt[0]*3600+tt[1]*60+tt[2]*1}`);
            });
        });
        run_clock = false;
    }
}, 10000);