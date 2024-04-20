let siteurl = "";

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "64");
    return url.toString();
}

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    siteurl = url.split("//")[1].split("/")[0];
    if(!isValidUrl(siteurl)) {
        let bouton = document.getElementById("ajout");
        bouton.parentNode.removeChild(bouton);
        let icon = document.getElementById("theicon");
        icon.parentNode.removeChild(icon);
        let url = document.getElementById("theurl");
        url.parentNode.removeChild(url);
    } else {
        document.getElementById("theurl").textContent = siteurl;
        document.getElementById("theicon").src = tabs[0].favIconUrl; 
    }
});


const button_add = document.getElementById('ajout'); 
button_add.addEventListener('click', function() { 
    if(siteurl != "") {
        var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
            '(\\#[-a-z\\d_]*)?$','i');
        if(!!urlPattern.test(siteurl)) {
            //The input is a valid url
            chrome.storage.local.get(["dfn_websites"]).then((result) => {
                let sitelist = result.dfn_websites;
                if(sitelist.includes(siteurl)) {
                    console.log("Didn't add this website because it already was in the list.")
                } else {
                    newlist = sitelist.concat(siteurl);
                    console.log(newlist);
                    chrome.storage.local.set({dfn_websites: newlist}).then(() => {
                        chrome.storage.local.get(["dfn_websites"]).then((result) => {
                            console.log("The new array is:");
                            console.log(result.dfn_websites);
                        });
                    });
                    (async () => {
                        const response = await chrome.runtime.sendMessage({message: "killedTab"});
                        console.log(response);
                      })();
                }
            });
        } else {
            console.log("Didn't add this website because it's not a valid url")
        }
    }
});

const button_manage = document.getElementById("manage");
button_manage.addEventListener("click", function() {
    chrome.tabs.create({ url: "../html/manage.html"});
})