function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/blocked_${sheet_ext}.css`);
}

chrome.storage.local.get().then((result) => {
    if(result.dfn_use_dark_mode) {
        setEltsColor("dark");
    }
});

const button_manage = document.getElementById("manage");
button_manage.addEventListener("click", function() {
    chrome.tabs.query({ active: true }, function(tabs) {  
        chrome.tabs.remove(tabs[0].id);   
    });
    chrome.tabs.create({ url: "../html/set_block.html"});
})