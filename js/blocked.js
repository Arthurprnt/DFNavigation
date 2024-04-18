const button_manage = document.getElementById("manage");
button_manage.addEventListener("click", function() {
    chrome.tabs.query({ active: true }, function(tabs) {  
        chrome.tabs.remove(tabs[0].id);   
    });
    chrome.tabs.create({ url: "../html/manage.html"});
})