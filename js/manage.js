const elts_blo = document.getElementById("sites_blo");
var texts_blo = [];
var paras_blo = [];
var btns_blo = [];
const elts_lim = document.getElementById("sites_lim");
var texts_lim = [];
var paras_lim = [];
var btns_lim = [];

function rm_elt_blo(texte) {
    chrome.storage.local.get().then((result) => {
        if(result.dfn_blocked.includes(texte)) {
            let ind = result.dfn_blocked.indexOf(texte);
            let newlist = result.dfn_blocked;
            let para = document.getElementById(`${texte}-blo`);
            para.remove();
            newlist.splice(ind,1);
            chrome.storage.local.set({dfn_blocked: newlist}).then(() => {
                console.log("Successfully removed the domain from the blocked list")
            });
        }
    });
}

function rm_elt_lim(texte) {
    chrome.storage.local.get().then((result) => {
        if(result.dfn_limited.includes(texte)) {
            let ind = result.dfn_limited.indexOf(texte);
            let newlist = result.dfn_limited;
            let para = document.getElementById(`${texte}-lim`);
            para.remove();
            newlist.splice(ind,1);
            chrome.storage.local.set({dfn_limited: newlist}).then(() => {
                console.log("Successfully removed the domain from the limited list");
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

chrome.storage.local.get().then((result) => {
    console.log(result);
    for(i=0; i<result.dfn_blocked.length; i+=1) {
        const txt = result.dfn_blocked[i];
        paras_blo[i] = document.createElement("p");
        paras_blo[i].id = `${txt}-blo`;
        paras_blo[i].className = "liste";
        texts_blo[i] = document.createTextNode(`- ${result.dfn_blocked[i]} `);
        btns_blo[i] = document.createElement("button");
        btns_blo[i].textContent = 'x';
        btns_blo[i].id = `button-${i}`;
        btns_blo[i].className = "button";
        btns_blo[i].addEventListener("click", function() {
            rm_elt_blo(txt);
        });
        paras_blo[i].appendChild(texts_blo[i]);
        paras_blo[i].appendChild(btns_blo[i]);
        elts_blo.appendChild(paras_blo[i]);
    }
    for(i=0; i<result.dfn_limited.length; i+=1) {
        const txt = result.dfn_limited[i];
        paras_lim[i] = document.createElement("p");
        paras_lim[i].id = `${txt}-lim`;
        paras_lim[i].className = "liste";
        texts_lim[i] = document.createTextNode(`- ${result.dfn_limited[i]} `);
        btns_lim[i] = document.createElement("button");
        btns_lim[i].textContent = 'x';
        btns_lim[i].id = `button-${i}`;
        btns_lim[i].className = "button";
        btns_lim[i].addEventListener("click", function() {
            rm_elt_lim(txt);
        });
        paras_lim[i].appendChild(texts_lim[i]);
        paras_lim[i].appendChild(btns_lim[i]);
        elts_lim.appendChild(paras_lim[i]);
    }
});

document.getElementById("accept_blo").addEventListener("click", function() {
    const domain = document.getElementById("adding").value;
    document.getElementById("adding").value = "";
    if(isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            liste = result.dfn_blocked;
            liste.push(domain);
            chrome.storage.local.set({dfn_blocked: liste}).then(() => {
                console.log("Successfuly added the domain to the block list");
                let ind = paras_blo.length;
                paras_blo.push(document.createElement("p"));
                paras_blo[ind].id = `${domain}-blo`;
                paras_blo[ind].className = "liste";
                texts_blo.push(document.createTextNode(`- ${domain} `));
                btns_blo.push(document.createElement("button"));
                btns_blo[ind].textContent = 'x';
                btns_blo[ind].id = `button-${i}`;
                btns_blo[ind].className = "button";
                btns_blo[ind].addEventListener("click", function() {
                    rm_elt_blo(domain);
                });
                paras_blo[ind].appendChild(texts_blo[ind]);
                paras_blo[ind].appendChild(btns_blo[ind]);
                elts_blo.appendChild(paras_blo[ind]);
            });
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
})

document.getElementById("accept_lim").addEventListener("click", function() {
    const domain = document.getElementById("limit").value;
    document.getElementById("limit").value = "";
    if(isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            liste = result.dfn_limited;
            liste.push(domain);
            chrome.storage.local.set({dfn_limited: liste}).then(() => {
                console.log("Successfuly added the domain to the limit list");
                let ind = paras_lim.length;
                paras_lim.push(document.createElement("p"));
                paras_lim[ind].id = `${domain}-lim`;
                paras_lim[ind].className = "liste";
                texts_lim.push(document.createTextNode(`- ${domain} `));
                btns_lim.push(document.createElement("button"));
                btns_lim[ind].textContent = 'x';
                btns_lim[ind].id = `button-${i}`;
                btns_lim[ind].className = "button";
                btns_lim[ind].addEventListener("click", function() {
                    rm_elt_lim(domain);
                });
                paras_lim[ind].appendChild(texts_lim[ind]);
                paras_lim[ind].appendChild(btns_lim[ind]);
                elts_lim.appendChild(paras_lim[ind]);
            });
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
})

hh = document.getElementById("hour");
mm = document.getElementById("minute");
ss = document.getElementById("sec");

chrome.storage.local.get().then((result) => {
    let tt = result.dfn_timer;
    hh.value = tt[0];
    mm.value = tt[1];
    ss.value = tt[2];
});

function manage_min_max(obj, m_val) {
    if(obj.value > m_val) {
        obj.value = m_val;
    } else if(obj.value < 0) {
        obj.value = 0;
    }
    save_timer();
}

function save_timer() {
    let time = [hh.value, mm.value, ss.value];
    console.log(time);
    chrome.storage.local.set({dfn_timer: time}).then(() => {
        console.log("Saved time");
    });
}

hh.addEventListener("change", function() {
    manage_min_max(hh, 24);
})
mm.addEventListener("change", function() {
    manage_min_max(mm, 60);
})
ss.addEventListener("change", function() {
    manage_min_max(ss, 60);
})