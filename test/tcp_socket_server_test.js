var vows = require('vows'),
    suite = vows.describe('socket_server'),
    socketServer = require('./../lib/servers/socket_server.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};

var net = require('net');

suite.addBatch({
    'A TCP socket_server': {
        topic: function () {
            'use strict';
            socketServer.start(8081, testTimeSource, this.callback);
        },
        'starts up properly': function (err, stat) {
            'use strict';
            assert.isNull(err);
            assert.instanceOf(stat, net.Server);
        },
        'requesting a number': {
            topic: function (server) {
                'use strict';
                var client = net.connect(8081, 'localhost');
                client.on('data', this.callback);
                client.end();
            },
            'returns a valid number': function (result, stat) {
                'use strict';
                assert.equal(result.toString().length, 19);
            }
        }
    }
}).export(module);
