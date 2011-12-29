var vows = require('vows'),
    suite = vows.describe('id_listener')
    idListener = require('./../lib/idlistener.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0'),
    testTimeSource = {'lastTimestamp': lastTimestamp,
                      'lastSequence': lastSequence};
    
suite.addBatch({
    'An id_listener': {
        topic: idListener,
        'writes a number using a passed in writer': function (topic) {
            var testData;
            topic.listen_for_id(testTimeSource, function (data) {
                testData = data;
            });
            assert.isNotNull(testData);
            assert.typeOf(testData, 'string');
            assert.isTrue(testData.match(/Exception/) == null);
            assert.isTrue(testData.match(/Failed/) == null);
            assert.isTrue(testData.length == 19);
        },
        'updates the lastSequence and lastTimeStamp values': function (topic) {
            var startingTimestamp = testTimeSource['lastTimestamp'];
            var startingSequence = testTimeSource['lastSequence'];
            topic.listen_for_id(testTimeSource, function (data) {
                var testData = data;
            });
            assert.isTrue((testTimeSource['lastTimestamp'] == startingTimestamp && testTimeSource['lastSequence'].compareTo(startingSequence) == 1)
                         || testTimeSource['lastTimestamp'] > startingTimestamp );
        }
    }
}).export(module);
