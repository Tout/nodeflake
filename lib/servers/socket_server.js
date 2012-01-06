var net = require('net'),
    handle = require('../handlers/socket_handler.js').handle,
    EventEmitter = require('events').EventEmitter;

var socketServer = new EventEmitter();

socketServer.start = function (binding, currentTimeValues, callback) {
    'use strict';
    var server;
    socketServer.on('ready', function (stream) {
        callback(null, server);
    });
    server = net.createServer(function (connection) {
        handle(connection, currentTimeValues);
    }).listen(binding, function () {
        socketServer.emit('ready', true);
    });
};
module.exports = socketServer;
