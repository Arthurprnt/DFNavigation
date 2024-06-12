const toggle_dark = document.getElementById("toggle_darkmode");
const toggle_hardcore = document.getElementById("toggle_hardcore");
var hc_click_nb = 0;
let hc_activated;

const elts_cus = document.getElementById("custom_lim_div");
var texts_cus = [];
var paras_cus = [];
var btns_cus = [];
var timers_cus = [];
var hh_cus = [];
var mm_cus = [];
var ss_cus = [];
var hh_txt_cus = [];
var mm_txt_cus = [];
var ss_txt_cus = [];

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
    swapStyleSheet("header_style", `../css/header_${sheet_ext}.css`);
}

function manage_min_max(obj, m_val, domain, ind) {
    if(obj.value > m_val) {
        obj.value = m_val;
    } else if(obj.value < 0) {
        obj.value = 0;
    }
    save_timer(domain, ind);
}

function save_timer(domain, ind) {
    chrome.storage.local.get().then((result) => {
        let time = [hh_cus[ind].value, mm_cus[ind].value, ss_cus[ind].value];
        let dico = result.dfn_custom_limited;
        dico[domain] = time;
        chrome.storage.local.set({dfn_custom_limited: dico}).then(() => {
            console.log(`Saved time for the domain ${domain}`);
        });
    });
}

function showChild(res, paras, texts, btns, elts, rm_f, id_ext) {
    let i = 0;
    for(let key in res) {
        const txt = key;
        let vals = res[key];
        paras[i] = document.createElement("p");
        paras[i].id = `${txt}-${id_ext}`;
        paras[i].className = "liste";
        texts[i] = document.createTextNode(`- ${key} :`);
        addCaseTimer(hh_cus, hh_txt_cus, "24", "h", i, key, vals[0]);
        addCaseTimer(mm_cus, mm_txt_cus, "60", "m", i, key, vals[1]);
        addCaseTimer(ss_cus, ss_txt_cus, "60", "s", i, key, vals[2]);
        btns[i] = document.createElement("button");
        btns[i].textContent = 'x';
        btns[i].id = `button`;
        btns[i].className = "button";
        btns[i].addEventListener("click", function() {
            rm_f(txt);
        });
        paras[i].appendChild(texts[i]);
        paras[i].appendChild(hh_cus[i]);
        paras[i].appendChild(hh_txt_cus[i]);
        paras[i].appendChild(mm_cus[i]);
        paras[i].appendChild(mm_txt_cus[i]);
        paras[i].appendChild(ss_cus[i]);
        paras[i].appendChild(ss_txt_cus[i]);
        paras[i].appendChild(btns[i]);
        elts.appendChild(paras[i]);
        i += 1;
    }
}

function rm_elt_cus(texte) {
    chrome.storage.local.get().then((result) => {
        if(result.dfn_custom_limited[texte] !== undefined) {
            let new_lim_dico = result.dfn_custom_limited;
            let para = document.getElementById(`${texte}-cus`);
            para.remove();
            delete new_lim_dico[texte];
            chrome.storage.local.set({dfn_custom_limited: new_lim_dico}).then(() => {
                console.log("Successfully removed the domain from the custom_limited list");
            });
        }
    });
}

function addCaseTimer(input_name, input_txt_name, vmax, timeExt, ind, domain, val) {
    input_name.push(document.createElement("input"));
    input_name[ind].type = "number";
    input_name[ind].min = "0";
    input_name[ind].max = vmax;
    input_name[ind].value = val;
    input_name[ind].className = "case_cus_timer";
    input_name[ind].addEventListener("change", function() {
        manage_min_max(input_name, vmax, domain, ind);
    })
    input_txt_name.push(document.createElement("p"));
    input_txt_name[ind].innerText = timeExt;
    input_txt_name[ind].className = "txt_timer_cus";
}

function addChild(paras, texts, btns, elts, rm_f, id_ext, btn_id) {
    const domain = document.getElementById(btn_id).value;
    document.getElementById(btn_id).value = "";
    if(isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            if(result.dfn_custom_limited[domain] === undefined) {
                let dico = result.dfn_custom_limited;
                dico[domain] = ["0", "30", "0"];
                chrome.storage.local.set({dfn_custom_limited: dico}).then(() => {
                    console.log(`Successfuly added the domain to the ${btn_id} list`);
                    const ind = paras.length;
                    paras.push(document.createElement("p"));
                    paras[ind].id = `${domain}-${id_ext}`;
                    paras[ind].className = "liste";
                    texts.push(document.createTextNode(`- ${domain} :`));
                    addCaseTimer(hh_cus, hh_txt_cus, "24", "h", ind, domain, "0");
                    addCaseTimer(mm_cus, mm_txt_cus, "60", "m", ind, domain, "30");
                    addCaseTimer(ss_cus, ss_txt_cus, "60", "s", ind, domain, "0");
                    btns.push(document.createElement("button"));
                    btns[ind].textContent = 'x';
                    btns[ind].id = `button`;
                    btns[ind].className = "button";
                    btns[ind].addEventListener("click", function() {
                        rm_f(domain);
                    });
                    paras[ind].appendChild(texts[ind]);
                    paras[ind].appendChild(hh_cus[ind]);
                    paras[ind].appendChild(hh_txt_cus[ind]);
                    paras[ind].appendChild(mm_cus[ind]);
                    paras[ind].appendChild(mm_txt_cus[ind]);
                    paras[ind].appendChild(ss_cus[ind]);
                    paras[ind].appendChild(ss_txt_cus[ind]);
                    paras[ind].appendChild(btns[ind]);
                    elts.appendChild(paras[ind]);
                });
            } else {
                console.log("Didn't add the domain because it's already limited");        
            }
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
}

chrome.storage.local.get().then((result) => {
    showChild(result.dfn_custom_limited, paras_cus, texts_cus, btns_cus, elts_cus, rm_elt_cus, "cus");
    if(result.dfn_use_dark_mode) {
        toggle_dark.checked = result.dfn_use_dark_mode;
        setEltsColor("dark");
    }
    toggle_hardcore.checked = result.dfn_hardcore_mode;
    hc_activated = result.dfn_hardcore_mode;
    if(result.dfn_pwd == "") {
        document.getElementById("put_pwd").style.display = "block";
        document.getElementById('enter_pwd_div').remove();
    }
});

toggle_dark.addEventListener("click", function() {
    chrome.storage.local.get().then((result) => {
        let bool_val = !result.dfn_use_dark_mode;
        chrome.storage.local.set({dfn_use_dark_mode: bool_val}).then(() => {
            if(bool_val) {
                setEltsColor("dark");
            } else {
                setEltsColor("light");
            }
        });
    });
})

toggle_hardcore.addEventListener("click", function() {
    if(!hc_activated) {
        if(hc_click_nb < 3) {
            toggle_hardcore.checked = false;
            hc_click_nb += 1;
            document.getElementById(`hc_conf_${hc_click_nb}`).style.display = "flex";
            console.log(hc_click_nb);
        } else {
            for(i=1; i<4; i+=1) {
                document.getElementById(`hc_conf_${i}`).style.display = "none";
            }
            document.getElementById(`hc_conf_4`).style.display = "flex";
            chrome.storage.local.set({dfn_hardcore_mode: true}).then(() => {
                hc_activated = true;
            });
        }
    } else {
        toggle_hardcore.checked = true;
    }
})

document.getElementById("pwd_btn").addEventListener("click", function() {
    let pwd_input = document.getElementById("pwd_txt");
    let conf_input = document.getElementById("confirm_pwd_txt");
    if(conf_input.value != "" && pwd_input.value == conf_input.value) {
        chrome.storage.local.set({dfn_pwd: conf_input.value}).then(() => {
            alert("Saved the password with success");
            pwd_input.value = "";
            conf_input.value = "";
        });
    } else {
        alert("The two passwords are not the same or one of them is empty.");
    }
})

document.getElementById("del_pwd_btn").addEventListener("click", function() {
    chrome.storage.local.set({dfn_pwd: ""}).then(() => {
        alert("Deleted the password with success");
    });
})

document.getElementById("access_btn").addEventListener("click", function() {
    let pwd_input = document.getElementById("pwd_input");
    chrome.storage.local.get().then((result) => {
        if(result.dfn_pwd == pwd_input.value) {
            document.getElementById("put_pwd").style.display = "block";
            document.getElementById('enter_pwd_div').remove();
        } else {
            alert("Wrong password.");
            pwd_input.value = "";
        }
    });
})

document.getElementById("limit_btn").addEventListener("click", function() {
    addChild(paras_cus, texts_cus, btns_cus, elts_cus, rm_elt_cus, "cus", "limiting");
})