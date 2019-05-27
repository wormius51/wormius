const socketer = require('../../scripts/socketer');
const Species = require('./species');
const antiswearing = require('./Antiswearing');
const cooldown = require('./CoolDown');
const chatCooldown = cooldown(3);
const spawnCooldown = cooldown(5);
var maxCommentLength = 100;

const namespace = "/food-chain-game";

var isLogging = false;

function start() {
    socketer.addListener(namespace, "add-species", (data, socket, nsp) => {
        if (data.name && !antiswearing.Check4Link(data.name) && !antiswearing.Check4Swear(data.name)) {
            let timeout = spawnCooldown.UserAction(socket.id);
            if (timeout >= 0) {
                socket.emit('bad-request', "Please wait " + timeout + " seconds.");
                return;
            }
            let species = Species(data.name, data.preyID, data.column,data.race);
            if (species) {
                nsp.emit('species-added',species);
            }
        } else {
            socket.emit('bad-request', "Please enter a name.");
        }
    });

    socketer.addListener(namespace, "say", (data, socket, nsp) => {
        if (data.message) {
            if (!data.nickname) data.nickname = "Mr.nothing";
            if (data.message.length > maxCommentLength) {
                data.message = "< over " + maxCommentLength + " characters >";
                socket.emit('comment-added',data);
            } else {
                if (antiswearing.Check4Swear(data.message) || antiswearing.Check4Swear(data.nickname)
                || antiswearing.Check4Link(data.message) || antiswearing.Check4Link(data.nickname)) {
                    socket.emit('comment-added',{nickname: "Mr.mod", message: "Sorry, not going to happen."});
                } else {
                    let timeout = chatCooldown.UserAction(socket.id);
                    if (timeout >= 0) {
                        socket.emit('comment-added',{nickname: "Mr.mod", message: "Wait " + timeout + " seconds."});
                        return;
                    }
                    nsp.emit('comment-added',data);
                }
            }
        }
    });
}

/**
 * Notifies the clients that this species has been removed.
 * @param {Species} species 
 */
function removeSpecies(species) {
    socketer.getNamespace(namespace).emit('species-removed',species);
}
/**
 * Notifies the clients that this species has been updated.
 * @param {Species} species 
 */
function updateSpecies(species) {
    socketer.getNamespace(namespace).emit('species-updated',species);
}
/**
 * Notifies the clients that the masses have been changed.
 * @param {Number[]} masses 
 */
function updateMasses(masses) {
    socketer.getNamespace(namespace).emit('masses-updated',masses);
}


module.exports.start = start;
module.exports.setLogging = (log) => { isLogging = log };
module.exports.removeSpecies = removeSpecies;
module.exports.updateSpecies = updateSpecies;
module.exports.updateMasses = updateMasses;