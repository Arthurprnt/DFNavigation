const elts_lim = document.getElementById("limited_div");
var texts_lim = [];
var paras_lim = [];
var btns_lim = [];

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
    swapStyleSheet("header_style", `../css/header_${sheet_ext}.css`);
}

function rm_elt_lim(texte) {
    chrome.storage.local.get().then((result) => {
        if(result.dfn_limited.includes(texte)) {
            let ind = result.dfn_limited.indexOf(texte);
            let new_lim_list = result.dfn_limited;
            let para = document.getElementById(`${texte}-lim`);
            para.remove();
            new_lim_list.splice(ind, 1);
            chrome.storage.local.set({dfn_limited: new_lim_list}).then(() => {
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

function addTimeToTxt(value, format) {
    if(value != 0) {
        if(String(value).length == 1) {
            return `0${value}${format}`;
        } else {
            return `${value}${format}`;
        }
    }  else {
        return "";
    }
}

chrome.storage.local.get().then((result) => {
    showChild(result.dfn_limited, paras_lim, texts_lim, btns_lim, elts_lim, rm_elt_lim, "lim");
    if(result.dfn_use_dark_mode) {
        setEltsColor("dark");
    }
    if(result.dfn_pwd == "") {
        document.getElementById("limited_div").style.display = "block";
        document.getElementById('enter_pwd_div').remove();
    }
    let spent_time = result.dfn_day_time;
    let spent_hours = Math.floor(spent_time/3600);
    let spent_minutes = Math.floor((spent_time-spent_hours)/60);
    let spent_secondes = spent_time-(spent_hours*3600)-(spent_minutes*60);
    let spent_txt = "";
    spent_txt += addTimeToTxt(spent_hours, "h");
    spent_txt += addTimeToTxt(spent_minutes, "m");
    spent_txt += addTimeToTxt(spent_secondes, "s");
    document.getElementById("report_p").innerText = `You've already spent ${spent_txt} on limited websites.`;
});

document.getElementById("limit_btn").addEventListener("click", function() {
    addChild(paras_lim, texts_lim, btns_lim, elts_lim, rm_elt_lim, "lim", "limiting");
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

hh.addEventListener("change", function() {
    manage_min_max(hh, 24);
})
mm.addEventListener("change", function() {
    manage_min_max(mm, 60);
})
ss.addEventListener("change", function() {
    manage_min_max(ss, 60);
})

document.getElementById("access_btn").addEventListener("click", function() {
    let pwd_input = document.getElementById("pwd_input");
    chrome.storage.local.get().then((result) => {
        if(result.dfn_pwd == pwd_input.value) {
            document.getElementById("limited_div").style.display = "block";
            document.getElementById('enter_pwd_div').remove();
        } else {
            alert("Wrong password.");
            pwd_input.value = "";
        }
    });
})