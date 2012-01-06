var httpServer = require('./servers/http_server.js'),
    socketServer = require('./servers/socket_server.js');

function start(server_type, binding, currentTimeValues, callback) {
    'use strict';
    if (server_type === 'socket') {
        socketServer.start(binding, currentTimeValues, callback);
    } else {
        httpServer.start(binding, currentTimeValues, callback);
    }
}

exports.start = start;
