const GameObject = require('./gameObject');


function Looker(x) {
    let looker = GameObject(x,40, "rgb(169, 156, 190)", "looker", "enemy");
    looker.eye = GameObject(x,10,"red","eye","enemy");
    looker.eye.allwaysUpdate = true;
    looker.eyePos = 0;
    looker.left = true;
    looker.onUpdate = () => {
        if (looker.eyePos <= -15) {
            looker.left = false;
        } else if (looker.eyePos >= 15) {
            looker.left = true;
        }
        looker.eyePos += (looker.left ? -1 : 1) * 0.2;
        looker.eye.x = looker.x + looker.eyePos;
        looker.eye.update = true;
    };
    return looker;
}


module.exports.Looker = Looker;