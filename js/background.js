chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.local.set({dfn_websites: []}).then(() => {
        chrome.storage.local.get(["dfn_websites"]).then((result) => {
            console.log("Created the array to stock websites:");
            console.log(result.dfn_websites);
        });
    });
})

chrome.runtime.onMessage.addListener( // this is the message listener
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.message == "killedTab")
            chrome.tabs.query({ active: true }, function(tabs) {  
                chrome.tabs.remove(tabs[0].id);   
            });
            chrome.tabs.create({ url: "../html/blocked.html"});
            sendResponse({res: "sucess"});
    }
);