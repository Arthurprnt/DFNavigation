importScripts('ExtPay.js');
var extpay = ExtPay('dfnavigation'); 
extpay.startBackground();
let run_clock = false;

chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.local.set({dfn_blocked: []}).then(() => {
        console.log("Initialised blocked list");
    });
    chrome.storage.local.set({dfn_limited: []}).then(() => {
        console.log("Initialised limited list");
    });
    chrome.storage.local.set({dfn_timer: [0, 45, 0]}).then(() => {
        console.log("Initialised timer list");
    });
    chrome.storage.local.set({dfn_day_time: 0}).then(() => {
        console.log("Initialised day's timer list");
    });
    let now = new Date().getDate();
    chrome.storage.local.set({dfn_last_connection: now}).then(() => {
        console.log(`Initialised last connection list to ${now}`);
    });
    chrome.storage.local.set({dfn_use_dark_mode: false}).then(() => {
        console.log(`Initialised dark mode use to false`);
    });
    chrome.storage.local.set({dfn_pwd: ""}).then(() => {
        console.log(`Initialised password as blank`);
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
        } else if(request.message == "runClock") {
            run_clock = true;
            sendResponse({res: "sucess"})
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