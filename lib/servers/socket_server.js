var net = require('net'),
    handle = require('../handlers/socket_handler.js').handle,
    EventEmitter = require('events').EventEmitter;

var socketServer = new EventEmitter();
    
socketServer.start = function (binding, currentTimeValues, callback) {
    socketServer.on('ready', function (stream) {
        callback(null, server);
    });
    var server = net.createServer(function (connection) {
        handle(connection, currentTimeValues);
    }).listen(binding, function () {
        socketServer.emit('ready', true);
    });
}
module.exports = socketServer;
