let url = document.URL;
let siteurl = url.split("//")[1].split("/")[0];
console.log(siteurl);
chrome.storage.local.get(["dfn_websites"]).then((result) => {
    for(i=0; i<result.dfn_websites.length; i+=1) {
        if([result.dfn_websites[i], `www.${result.dfn_websites[i]}`, result.dfn_websites[i].replace("www.", "")].includes(siteurl)) {
            console.log("The page will be blocked soon...");
            window.stop();
            (async () => {
                const response = await chrome.runtime.sendMessage({message: "killedTab"});
                console.log(response);
              })();
    
        }
    }
});