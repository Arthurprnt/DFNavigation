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
    let bouton = document.getElementById("block");
    bouton.parentNode.removeChild(bouton);
    let icon = document.getElementById("favicon");
    icon.parentNode.removeChild(icon);
    let url = document.getElementById("domain");
    url.parentNode.removeChild(url);
    let lim = document.getElementById("switch");
    lim.parentNode.removeChild(lim);
    let lim_title = document.getElementById("toggle_title");
    lim_title.parentNode.removeChild(lim_title);
}

let domain = "";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let full_url = tabs[0].url;
    if(full_url.startsWith("chrome-extension://")) {
        rm_site_menu();
    } else {
        domain = full_url.split("//")[1].split("/")[0];
        if(domain == "url" || !isValidUrl(domain)) {
            rm_site_menu();
        } else {
            document.getElementById("domain").textContent = domain;
            document.getElementById("favicon").src = tabs[0].favIconUrl;
            chrome.storage.local.get(["dfn_limited"]).then((result) => {
                for(i=0; i<result.dfn_limited.length; i+=1) {
                    if([result.dfn_limited[i], `www.${result.dfn_limited[i]}`, result.dfn_limited[i].replace("www.", "")].includes(domain)) {
                        document.getElementById("toggle_btn").checked = true;
                    }
                }
            });
        }
    }
});


const button_add = document.getElementById('block'); 
button_add.addEventListener('click', function() { 
    if(domain != "" && isValidUrl(domain)) {
        chrome.storage.local.get(["dfn_blocked"]).then((result) => {
            let blocked_sites = result.dfn_blocked;
            if(blocked_sites.includes(domain)) {
                console.log("Didn't add this website because it already was in the blocked list.")
            } else {
                new_blocked_list = blocked_sites.concat(domain);
                chrome.storage.local.set({dfn_blocked: new_blocked_list}).then(() => {
                    console.log("Successfully added this website to the blocked list");
                });
                (async () => {
                    const response = await chrome.runtime.sendMessage({message: "blockedTab"});
                    console.log(response);
                })();
            }
        });
    } else {
        console.log("Didn't add this website because it's not a valid url")
    }
});

const toggle_obj = document.getElementById("toggle_btn");
toggle_obj.addEventListener("click", function() {
    if(isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            let limited_sites = result.dfn_limited;
            if(limited_sites.includes(domain)) {
                let ind = result.dfn_limited.indexOf(domain);
                let new_limited_list = result.dfn_limited;
                new_limited_list.splice(ind,1);
                chrome.storage.local.set({dfn_limited: new_limited_list}).then(() => {
                    console.log("Successfully removed the domain from the limited list");
                });
            } else {
                new_limited_list = limited_sites.concat(domain);
                chrome.storage.local.set({dfn_limited: new_limited_list}).then(() => {
                    console.log("Successfully added this website to the limited list");
                });
            }
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    }
})

const settings_button = document.getElementById("settings");
settings_button.addEventListener("click", function() {
    chrome.tabs.create({ url: "../html/set_block.html"});
})