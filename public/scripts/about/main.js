

window.addEventListener('load', () => {
    const ageSpan = document.getElementById('ageSpan');
    ageSpan.innerText = age();
});


function age () {
    const now = new Date();
    const years = now.getFullYear() - 1991;
    if (now.getMonth() < 9)
        return years - 1;

    return years;
}