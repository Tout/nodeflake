var http = require('http'),
    url = require('url'),
    EventEmitter = require('events').EventEmitter,
    handle = require('../handlers/http_handler.js').handle;
    
var httpServer = new EventEmitter();

httpServer.start = function (port, currentTimeValues, callback) {
    httpServer.on('ready', function (stream) {
        callback(null, server);
    })
    var server = http.createServer(function (request, response) {
        handle(response, request, currentTimeValues);
    }).listen(port, function () {
        httpServer.emit('ready', true);
    });
}

module.exports = httpServer;
