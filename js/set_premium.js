var extpay = ExtPay('dfnavigation');
const toggle_obj = document.getElementById("toggle_btn"); 

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
    swapStyleSheet("header_style", `../css/header_${sheet_ext}.css`);
}

document.getElementById("pay_btn").addEventListener('click', extpay.openPaymentPage)
document.getElementById("manage_btn").addEventListener('click', extpay.openPaymentPage)

chrome.storage.local.get().then((result) => {
    if(result.dfn_use_dark_mode) {
        toggle_obj.checked = result.dfn_use_dark_mode;
        setEltsColor("dark");
    }
    if(result.dfn_pwd == "") {
        document.getElementById("put_pwd").style.display = "block";
        document.getElementById('enter_pwd_div').remove();
    }
});

extpay.getUser().then(user => {
    document.getElementById("loading_txt").remove();
    if (user.paid) {
        document.getElementById('not_paid').remove();
        document.getElementById("paid").style.display = "block";
    } else {
        document.getElementById('paid').remove();
        document.getElementById("not_paid").style.display = "block";
    }
}).catch(err => {
    console.log(err);
})

toggle_obj.addEventListener("click", function() {
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