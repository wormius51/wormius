
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
                socket.on(listener.evenName, data => {
                    listener.callback(data, socket, nsp);
                });
            });
        });
    });
}

function Listener(evenName, callback) {
    return {
        evenName : evenName,
        callback : callback
    };
}

/**
 * Sets a listener at a speciphic namespace.
 * @param {String} namespace 
 * @param {String} evenName 
 * @param {Function} callback (data from user, socket, namespace)
 */
function addListener(namespace, evenName, callback) {
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
    nsp.listeners.push(Listener(evenName,callback));
}

function getSocketById(id) {
    return io.sockets.find(socket => {
        return socket.id == id;
    });
}

function getNamespace(name) {
    return io.of(name);
}

module.exports.listen = listen;
module.exports.addListener = addListener;
module.exports.getSocketById = getSocketById;
module.exports.getNamespace = getNamespace;