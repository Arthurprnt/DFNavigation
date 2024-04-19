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