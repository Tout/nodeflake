var vows = require('vows'),
    suite = vows.describe('http_handler'),
    httpHandler = require('./../lib/handlers/http_handler.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};

var req = {
        url: 'http://localhost:7337/'
    };
var res = {
        headers: {},
        body: '',
        writeHead: function (status, data) {
            'use strict';
            this.headers[status.toString()] = data;
        },
        end: function (data) {
            'use strict';
            this.body = data;
        }
    };
var reset = function () {
    'use strict';
    req.url = 'http://localhost:7337/';
    res.headers = {};
    res.body = '';
};

suite.addBatch({
    'An http_handler': {
        topic: httpHandler,
        'returns a 404 response for favicon': function (topic) {
            'use strict';
            req.url += 'images/favicon.png';
            topic.handle(res, req, testTimeSource);
            assert.isDefined(res.headers[404]);
            assert.equal(res.body, 'Not Found');
        },
        'returns a 200 response for any other path': function (topic) {
            'use strict';
            reset();
            topic.handle(res, req, testTimeSource);
            assert.isDefined(res.headers["200"]);
        },
        'returns a resulting number as a json object': function (topic) {
            'use strict';
            reset();
            topic.handle(res, req, testTimeSource);
            assert.isNumber(JSON.parse(res.body).id);
        }
    }
}).export(module);
