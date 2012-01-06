var vows = require('vows'),
    suite = vows.describe('server.js'),
    server = require('./../lib/server.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};

var net = require('net'),
    http = require('http');

suite.addBatch({
    'server': {
        topic: server,
        'returns a socket server when specified': function (topic) {
            'use strict';
            topic.start('socket', 8082, testTimeSource, function (server) {
                assert.instanceOf(server, net.Server);
            });
        },
        'returns an http server otherwise': function (topic) {
            'use strict';
            topic.start('http', 8083, testTimeSource, function (server) {
                assert.instanceOf(server, http.Server);
            });
        }
    }
}).export(module);