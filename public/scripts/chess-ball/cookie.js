
let cookie = {
    name: "Guest"
};

function saveCookie () {
    let cookieString = JSON.stringify(cookie);
    let date = new Date(Date.now() + 3*24*60*60*1000);
    document.cookie = "cookie=" + cookieString + "; path=/; expires=" + date.toUTCString();
}

function loadCookie () {
    let varRgx = /cookie=({[^;]+})/
    let cookieString = varRgx.exec(document.cookie);
    if (!cookieString) {
        return;
    }
    cookieString = cookieString[1];
    cookie = JSON.parse(cookieString);
}