importScripts('ExtPay.js');
var extpay = ExtPay('dfnavigation'); 
extpay.startBackground();

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
        }
    }
);