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
    effect.onUpdate = () => {
        effect.update = true;
        effect.color = "rgba(255,255,255," + effect.opacity + ")";
        effect.opacity -= 0.02;
        if (effect.opacity <= 0) effect.destroy = true;
    };
    effect.onCollision = other => {
        if (other.type != "player") return;
        if (other.id != effect.owner) {
            other.acceleration += (effect.x > other.x ? -1 : 1) * 0.05;
        }
    };
    effect.sound = "kick" + Math.floor(Math.random() * 4 + 1) + ".mp3";
    return effect;
}

module.exports.Effect = Effect;
module.exports.DamageEffect = DamageEffect;