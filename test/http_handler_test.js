var vows = require('vows'),
    suite = vows.describe('http_handler')
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
            this.headers[status.toString()] = data;
        },
        end: function (data) {
            this.body = data;
        }
    };
var reset = function () {
    req.url = 'http://localhost:7337/';
    res.headers = {};
    res.body = '';
}
    
suite.addBatch({
    'An http_handler': {
        topic: httpHandler,
        'returns a 404 response for favicon': function (topic) {
            req.url += 'images/favicon.png';
            topic.handle(res, req, testTimeSource);
            result = res;
            assert.isDefined(res.headers[404]);
            assert.equal(res.body, 'Not Found');
        },
        'returns a 200 response for any other path': function (topic) {
            reset();
            topic.handle(res, req, testTimeSource);
            assert.isDefined(res.headers["200"]);
        },
        'returns a resulting number as a json object': function (topic) {
            reset();
            topic.handle(res, req, testTimeSource);
            assert.isNumber(JSON.parse(res.body)["id"]);
        }
    }
}).export(module);
