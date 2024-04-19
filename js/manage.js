const elts = document.getElementById("sites");
var texts = [];
var paras = [];
var btns = [];

function rm_elt(texte) {
    chrome.storage.local.get(["dfn_websites"]).then((result) => {
        if(result.dfn_websites.includes(texte)) {
            let ind = result.dfn_websites.indexOf(texte);
            let newlist = result.dfn_websites;
            let para = document.getElementById(`${texte}`);
            para.remove();
            newlist.splice(ind,1);
            chrome.storage.local.set({dfn_websites: newlist}).then(() => {
                chrome.storage.local.get(["dfn_websites"]).then((result) => {
                    console.log("The new array is:");
                    console.log(result.dfn_websites);
                });
            });
        }
    });
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

chrome.storage.local.get(["dfn_websites"]).then((result) => {
    console.log(result.dfn_websites);
    for(i=0; i<result.dfn_websites.length; i+=1) {
        const txt = result.dfn_websites[i];
        paras[i] = document.createElement("p");
        paras[i].id = `${txt}`;
        paras[i].className = "liste";
        texts[i] = document.createTextNode(`- ${result.dfn_websites[i]} `);
        btns[i] = document.createElement("button");
        btns[i].textContent = 'x';
        btns[i].id = `button-${i}`;
        btns[i].className = "button";
        btns[i].addEventListener("click", function() {
            rm_elt(txt);
        });
        paras[i].appendChild(texts[i]);
        paras[i].appendChild(btns[i]);
        elts.appendChild(paras[i]);
    }
});

document.getElementById("accept").addEventListener("click", function() {
    const domain = document.getElementById("adding").value;
    document.getElementById("adding").value = "";
    if(isValidUrl(domain)) {
        chrome.storage.local.get(["dfn_websites"]).then((result) => {
            liste = result.dfn_websites;
            liste.push(domain);
            chrome.storage.local.set({dfn_websites: liste}).then(() => {
                chrome.storage.local.get(["dfn_websites"]).then((result) => {
                    console.log("The new array is:");
                    console.log(result.dfn_websites);
                    let ind = paras.length;
                    paras.push(document.createElement("p"));
                    paras[ind].id = `${domain}`;
                    paras[ind].className = "liste";
                    texts.push(document.createTextNode(`- ${domain} `));
                    btns.push(document.createElement("button"));
                    btns[ind].textContent = 'x';
                    btns[ind].id = `button-${i}`;
                    btns[ind].className = "button";
                    btns[ind].addEventListener("click", function() {
                        rm_elt(domain);
                    });
                    paras[ind].appendChild(texts[ind]);
                    paras[ind].appendChild(btns[ind]);
                    elts.appendChild(paras[ind]);
                });
            });
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
})