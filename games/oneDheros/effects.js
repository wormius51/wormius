const GameObject = require('./gameObject');

function Effect(x, width, color, name) {
    if (!name) name = "effect";
    if (!width) width = 10;
    if (!color) color = "white";
    let gameObject = GameObject(x, width, color, name, "effect");
    return gameObject;
}

function DamageEffect(x, width) {
    if (!width) width = 10;
    let effect = Effect(x, width);
    effect.opacity = 1;
    effect.r = 255;
    effect.g = 255;
    effect.b = 255;
    effect.enemy = false;
    effect.damage = 1;
    effect.onUpdate = () => {
        effect.update = true;
        effect.color = "rgba(" + effect.r + "," + effect.g + "," + effect.b + "," + effect.opacity + ")";
        effect.opacity -= 0.02;
        if (effect.opacity <= 0) effect.destroy = true;
    };
    effect.onCollision = other => {
        if (other.id != effect.owner) {
            if (other.type == "player") {
                other.acceleration += (effect.x > other.x ? -1 : 1) * 0.05;
                if (effect.enemy) {
                    other.hp -= effect.damage;
                }
            } else if (other.type == "enemy" && !effect.enemy) {
                other.hp -= effect.damage;
            }
        }
    };
    effect.sound = "kick" + Math.floor(Math.random() * 4 + 1) + ".mp3";
    return effect;
}

function LaserBeem(x, width) {
    if (!width) width = 40;
    let beem = DamageEffect(x, width);
    beem.g = 0;
    beem.b = 0;
    beem.r = 255;
    beem.color = "red";
    beem.enemy = true;
    beem.sound = "laser_kaboom.mp3";
    return;
}

module.exports.Effect = Effect;
module.exports.DamageEffect = DamageEffect;
module.exports.LaserBeem = LaserBeem;