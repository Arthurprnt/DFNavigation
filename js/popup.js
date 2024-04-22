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

function rm_site_menu() {
    let bouton = document.getElementById("ajout");
    bouton.parentNode.removeChild(bouton);
    let icon = document.getElementById("theicon");
    icon.parentNode.removeChild(icon);
    let url = document.getElementById("theurl");
    url.parentNode.removeChild(url);
    let lim = document.getElementById("alltoggle");
    lim.parentNode.removeChild(lim);
    let lim_title = document.getElementById("toggle_title");
    lim_title.parentNode.removeChild(lim_title);
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(url.startsWith("chrome-extension://")) {
        rm_site_menu();
    } else {
        siteurl = url.split("//")[1].split("/")[0];
        if(siteurl == "url" || !isValidUrl(siteurl)) {
            rm_site_menu();
        } else {
            document.getElementById("theurl").textContent = siteurl;
            document.getElementById("theicon").src = tabs[0].favIconUrl;
            chrome.storage.local.get(["dfn_limited"]).then((result) => {
                for(i=0; i<result.dfn_limited.length; i+=1) {
                    if([result.dfn_limited[i], `www.${result.dfn_limited[i]}`, result.dfn_limited[i].replace("www.", "")].includes(siteurl)) {
                        document.getElementById("toggle_btn").checked = true;
                    }
                }
            });
        }
    }
});


const button_add = document.getElementById('ajout'); 
button_add.addEventListener('click', function() { 
    if(siteurl != "") {
        if(isValidUrl(siteurl)) {
            chrome.storage.local.get(["dfn_blocked"]).then((result) => {
                let sitelist = result.dfn_blocked;
                if(sitelist.includes(siteurl)) {
                    console.log("Didn't add this website because it already was in the blocked list.")
                } else {
                    newlist = sitelist.concat(siteurl);
                    chrome.storage.local.set({dfn_blocked: newlist}).then(() => {
                        console.log("Successfully added this website to the blocked list");
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

const toggle_obj = document.getElementById("toggle_btn");
toggle_obj.addEventListener("click", function() {
    if(isValidUrl(siteurl)) {
        chrome.storage.local.get().then((result) => {
            let sitelist = result.dfn_limited;
            if(sitelist.includes(siteurl)) {
                let ind = result.dfn_limited.indexOf(siteurl);
                let newlist = result.dfn_limited;
                newlist.splice(ind,1);
                chrome.storage.local.set({dfn_limited: newlist}).then(() => {
                    console.log("Successfully removed the domain from the limited list");
                });
            } else {
                newlist = sitelist.concat(siteurl);
                chrome.storage.local.set({dfn_limited: newlist}).then(() => {
                    console.log("Successfully added this website to the limited list");
                });
            }
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    }
})