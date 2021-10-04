
function Upgrade (name, cost, action) {
    let upgrade = {
        name: name,
        cost: cost,
        level: 0,
        action: action
    };
    return upgrade;
}

const upgrades = [
    Upgrade("Accuracy", 4, () => bar.chargeSpeed *= 0.7),
    Upgrade("Power", 10, () => bar.power *= 1.3),
    Upgrade("Lift", 15, () => player.lift += 0.1),
    Upgrade("Jump", 20, () => {
        if (player.jumpSpeed == 0)
            player.jumpSpeed = 5;
        else
            player.jumpSpeed *= 1.3;
    })
];


function buyUpgrade (index) {
    if (gold < upgrades[index].cost)
        return;
    changeGold(-upgrades[index].cost);
    upgrades[index].level++;
    upgrades[index].cost *= 2;
} 

function applyUpgrades () {
    upgrades.forEach(upgrade => {
        for (let i = 0; i < upgrade.level; i++)
            upgrade.action();
    });
}