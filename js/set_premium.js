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