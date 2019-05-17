const GameObject = require('./gameObject');
const effects = require('./effects');

function Looker(x) {
    let looker = GameObject(x,40, "rgb(169, 156, 190)", "looker", "enemy");
    looker.eye = GameObject(x,10,"red","eye","enemy");
    looker.eye.allwaysUpdate = true;
    looker.eyePos = 0;
    looker.left = true;
    looker.state = "look";
    looker.charge = 0;
    looker.onUpdate = () => {
        switch (looker.state) {
            case "look":
                looker.charge++;
                look(looker);
                break;
            case "charge": 
                charge(looker);
                break;
            case "fire":
                fire(looker);
                break;
        }

        
    };
    return looker;
}

function look(looker) {
    if (looker.eyePos <= -12) {
        if (looker.charge >= 100)
            looker.state = "charge";
        looker.charge = 5;
        looker.left = false;
    } else if (looker.eyePos >= 12) {
        if (looker.charge >= 100)
            looker.state = "charge";
        looker.charge = 5;
        looker.left = true;
    }
    looker.eyePos += (looker.left ? -1 : 1) * 0.2;
    looker.eye.x = looker.x + looker.eyePos;
    looker.eye.update = true;
}

function charge(looker) {
    if (looker.eye.color == "red") {
        looker.eye.color = "orange";
    } else {
        looker.eye.color = "red";
    }
    looker.charge -= 0.1;
    if (looker.charge <= 0) {
        looker.state = "fire";
    }
}

function fire(looker) {
    effects.LaserBeem(looker.x + (looker.left ? 1 : -1) * looker.width);
    looker.eye.color = "red";
    looker.state = "look";
}

module.exports.Looker = Looker;