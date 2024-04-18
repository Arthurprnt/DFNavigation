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