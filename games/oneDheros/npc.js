const GameObject = require('./gameObject');
const faker = require('faker');

function NPC(x, color, message, quest) {
    if (!x) x = 0;
    if (!color) color = "green";
    let name = faker.name.prefix() + " " + faker.name.firstName();
    let npc = GameObject(x, 10, color, name, "npc");
    npc.message = message;
    if (quest) {
        npc.quest = quest;
        npc.onCollision = other => {
            if (other.type == "player") {
                if (!other.quest || other.quest.id != npc.id) {
                    other.questComplete = false;
                    other.killCount = 0;
                    other.quest = npc.quest;
                }
            }
        }
    }
    return npc;
}

function KillOneLaser(x) {
    let killOneLaser = NPC(x, "darkGreen",
        "I'll give you 5 upgrade pointsfor defeating one laser thing.",
        (playerObj, obj) => {
            if (playerObj.questComplete) return;
            if (obj && obj.name && obj.name == "looker") {
                if (obj.hp <= 0) {
                    playerObj.upgradePoints += 5;
                    playerObj.update = true;
                    playerObj.questComplete = true;
                }
            }
        }
    );
    return killOneLaser;
}

function KillFourDashers(x) {
    let killFourDashers = NPC(x, "orange", 
    "Get rid of 4 running things.  (20 upgrade points)",
    (playerObj, obj) => {
        if (playerObj.questComplete) return;
        if (obj && obj.name && obj.name == "dasher") {
            if (obj.hp <= 0) {
                if (playerObj.killCount) {
                    playerObj.killCount++;
                } else {
                    playerObj.killCount = 1;
                }
                if (playerObj.killCount >= 4) {
                    playerObj.upgradePoints += 20;
                    playerObj.update = true;
                    playerObj.questComplete = true;
                }
            }
        }
    });

    return killFourDashers;
}

module.exports = NPC;
module.exports.KillOneLaser = KillOneLaser;
module.exports.KillFourDashers = KillFourDashers;