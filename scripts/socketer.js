
var namespaces = [];

var io;

/**
 * Listen to socket events from the server.
 * @param {any} server 
 */
function listen(server) {
    io = require('socket.io').listen(server);
    namespaces.forEach(namespace => {
        let nsp = io.of(namespace.name);
        nsp.on('connection', socket => {
            namespace.listeners.forEach(listener => {
                socket.on(listener.eventName, data => {
                    listener.callback(data, socket, nsp);
                });
            });
        });
    });
}

function Listener(eventName, callback) {
    return {
        eventName : eventName,
        callback : callback
    };
}

/**
 * Sets a listener at a speciphic namespace.
 * @param {String} namespace 
 * @param {String} eventName 
 * @param {Function} callback (data from user, socket, namespace)
 */
function addListener(namespace, eventName, callback) {
    var nsp = namespaces.find(element => {
        return element.name == namespace;
    });;
    if (!nsp) {
        nsp = {
            name : namespace,
            listeners : []
        };
        namespaces.push(nsp);
    }
    nsp.listeners.push(Listener(eventName,callback));
}

function getSocketById(id) {
    return io.sockets.connected[id];
}

function emitTo(namespace, socketId, eventName, data) {
    io.to(namespace + "/" + socketId).emit(eventName, data);
}

function getNamespace(name) {
    return io.of(name);
}

module.exports.listen = listen;
module.exports.addListener = addListener;
module.exports.getSocketById = getSocketById;
module.exports.getNamespace = getNamespace;
module.exports.emitTo = emitTo;