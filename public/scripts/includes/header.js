const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function gameFullScreen() {
    document.getElementsByClassName("game-container")[0].children[0].requestFullscreen();
    screen.orientation.lock('landscape');
}


window.addEventListener('load', () => {
    let h4s = $("h4.primaryText");
    if (h4s.length > 0) {
        let dropdown = document.createElement('div');
        dropdown.className = "dropdown nav-item bg-light rounded border ml-1";
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
        $('header')[0].appendChild(dropdown);
    }
});