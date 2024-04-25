const elts_blo = document.getElementById("blocked_div");
var texts_blo = [];
var paras_blo = [];
var btns_blo = [];

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
    swapStyleSheet("header_style", `../css/header_${sheet_ext}.css`);
}

function rm_elt_blo(texte) {
    chrome.storage.local.get().then((result) => {
        if(result.dfn_blocked.includes(texte)) {
            let ind = result.dfn_blocked.indexOf(texte);
            let new_blo_list = result.dfn_blocked;
            let para = document.getElementById(`${texte}-blo`);
            para.remove();
            new_blo_list.splice(ind, 1);
            chrome.storage.local.set({dfn_blocked: new_blo_list}).then(() => {
                console.log("Successfully removed the domain from the blocked list")
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

function showChild(res, paras, texts, btns, elts, rm_f, id_ext) {
    for(i=0; i<res.length; i+=1) {
        const txt = res[i];
        paras[i] = document.createElement("p");
        paras[i].id = `${txt}-${id_ext}`;
        paras[i].className = "liste";
        texts[i] = document.createTextNode(`- ${res[i]} `);
        btns[i] = document.createElement("button");
        btns[i].textContent = 'x';
        btns[i].id = `button-${i}`;
        btns[i].className = "button";
        btns[i].addEventListener("click", function() {
            rm_f(txt);
        });
        paras[i].appendChild(texts[i]);
        paras[i].appendChild(btns[i]);
        elts.appendChild(paras[i]);
    }
}

function addChild(paras, texts, btns, elts, rm_f, id_ext, btn_id) {
    const domain = document.getElementById(btn_id).value;
    document.getElementById(btn_id).value = "";
    if(isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            let liste;
            let json;
            if(id_ext == "blo") {
                liste = result.dfn_blocked;
                json = {dfn_blocked: liste};
            } else {
                liste = result.dfn_limited;
                json = {dfn_limited: liste};
            }
            liste.push(domain);
            chrome.storage.local.set(json).then(() => {
                console.log(`Successfuly added the domain to the ${btn_id} list`);
                let ind = paras.length;
                paras.push(document.createElement("p"));
                paras[ind].id = `${domain}-${id_ext}`;
                paras[ind].className = "liste";
                texts.push(document.createTextNode(`- ${domain} `));
                btns.push(document.createElement("button"));
                btns[ind].textContent = 'x';
                btns[ind].id = `button-${i}`;
                btns[ind].className = "button";
                btns[ind].addEventListener("click", function() {
                    rm_f(domain);
                });
                paras[ind].appendChild(texts[ind]);
                paras[ind].appendChild(btns[ind]);
                elts.appendChild(paras[ind]);
            });
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
}

chrome.storage.local.get().then((result) => {
    showChild(result.dfn_blocked, paras_blo, texts_blo, btns_blo, elts_blo, rm_elt_blo, "blo");
    if(result.dfn_use_dark_mode) {
        setEltsColor("dark");
    }
    if(result.dfn_pwd == "") {
        document.getElementById("blocked_div").style.display = "block";
        document.getElementById('enter_pwd_div').remove();
    }
});

document.getElementById("block_btn").addEventListener("click", function() {
    addChild(paras_blo, texts_blo, btns_blo, elts_blo, rm_elt_blo, "blo", "blocking");
})

document.getElementById("access_btn").addEventListener("click", function() {
    let pwd_input = document.getElementById("pwd_input");
    chrome.storage.local.get().then((result) => {
        if(result.dfn_pwd == pwd_input.value) {
            document.getElementById("blocked_div").style.display = "block";
            document.getElementById('enter_pwd_div').remove();
        } else {
            alert("Wrong password.");
            pwd_input.value = "";
        }
    });
})