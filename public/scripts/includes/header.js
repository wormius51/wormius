const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function gameFullScreen() {
    document.getElementsByClassName("game-container")[0].children[0].requestFullscreen();
    screen.orientation.lock('landscape');
}


window.addEventListener('load', makeDropdown);
window.addEventListener('load', showSupporters);

function makeDropdown () {
    let h4s = $("h4.primaryText");
    if (h4s.length > 0) {
        let dropdown = document.getElementById("contentDropdown");
        dropdown.className = "dropdown nav-item bg-light rounded border ml-1";
        dropdown.id = "content-dropdown";
        let button = document.createElement('button');
        button.innerText = "Content";
        button.className = "btn dropdown-toggle";
        button.type = "button";
        button.id = "dropdownMenuButton";
        button.setAttribute('data-toggle', "dropdown");
        button.setAttribute('aria-haspopup', "true");
        button.setAttribute('aria-expanded', "false");
        dropdown.appendChild(button);
        let dropdownMenu = document.createElement('div');
        dropdownMenu.className = "dropdown-menu";
        dropdownMenu.setAttribute('aria-labelledby', "dropdownMenuButton");
        for (let i = 0; i < h4s.length; i++) {
            let a = document.createElement('a');
            a.innerHTML = h4s[i].innerHTML;
            if (!h4s[i].id) {
                h4s[i].id = h4s[i].innerHTML;
            }
            a.href = "#" + h4s[i].id;
            a.className = "dropdown-item";
            dropdownMenu.appendChild(a);
        }
        dropdown.appendChild(dropdownMenu);
    }
}

function showSupporters () {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
           if (xmlhttp.status == 200) {
               updateSupportersInfo(xmlhttp.responseText);
           }
        }
    };
    xmlhttp.open("GET", "/bmc/supporters", true);
    xmlhttp.send();
}

function updateSupportersInfo (data) {
    try {
        data = JSON.parse(data);
    } catch {
        return;
    }
    if (data.error) {
        console.log(data.error);
        return;
    }
    const supportersInfo = $("#supportersInfo span")[0];
    let supporters = data.data.map(supporter => {
        let name = supporter.supporter_name;
        let note = supporter.support_note;
        if (!name)
            return;
        return {name: name, note: note};
    });
    supporters = supporters.filter(supporter => supporter);
    if (supporters.length == 0)
        return;
    supportersInfo.innerText = "Supporters: ";
    for (const supporter of supporters) {
        supportersInfo.innerText += supporter.name;
        if (supporter.note)
            supportersInfo.innerText += `: "${supporter.note}"`;
        supportersInfo.innerText += ", \t";
    }
}