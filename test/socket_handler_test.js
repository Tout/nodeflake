var vows = require('vows'),
    suite = vows.describe('socket_handler'),
    socketHandler = require('./../lib/handlers/socket_handler.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};

var connection = {
    body: null,
    write: function (data) {
        'use strict';
        this.body = data;
    },
    reset: function () {
        'use strict';
        this.body = null;
    }
};

suite.addBatch({
    'A socket_handler': {
        topic: socketHandler,
        'writes a valid number to the given connection': function (topic) {
            'use strict';
            topic.handle(connection, testTimeSource);
            assert.lengthOf(connection.body, 19);
        }
    }
}).export(module);