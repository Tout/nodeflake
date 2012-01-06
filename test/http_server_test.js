var vows = require('vows'),
    suite = vows.describe('http_server'),
    httpServer = require('./../lib/servers/http_server.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};

var http = require('http'),
    options = {
        host: 'localhost',
        port: 8080,
        path: '/',
        agent: false
    };

suite.addBatch({
    'An http_server': {
        topic: function () {
            'use strict';
            httpServer.start(8080, testTimeSource, this.callback);
        },
        'starts up properly': function (err, stat) {
            'use strict';
            assert.isNull(err);
            assert.instanceOf(stat, http.Server);
        },
        'requesting favicon': {
            topic: function (server) {
                'use strict';
                options.path = '/favicon.png';
                http.get(options, this.callback);
            },
            'returns a 404 when requesting favicon': function (resp, stat) {
                'use strict';
                assert.isDefined(resp);
                assert.equal(resp.statusCode, 404);
            }
        },
        'requesting a number': {
            topic: function (server) {
                'use strict';
                options.path = '/';
                http.get(options, this.callback);
            },
            'returns a valid page': function (resp, stat) {
                'use strict';
                assert.isDefined(resp);
                assert.equal(resp.statusCode, 200);
            },
            'returns the id in the body': function (resp, stat) {
                'use strict';
                resp.on('data', function (chunk) {
                    assert.isNotEmpty(chunk);
                    assert.isNumber(JSON.parse(chunk).id);
                    assert.equal(JSON.parse(chunk).id.toString().length, 19);
                });
            }
        }
    }
}).export(module);
