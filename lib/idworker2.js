var LOG = require("./utils/log.js"),
    BigInteger = require("bigdecimal").BigInteger,
    config = require("../config.js"),
    timestamps = require('./timestamp.js');

// Set Some variables
var workerId = BigInteger(config.workerId),
    dataCenterId = BigInteger(config.dataCenterId),
    sequenceBits = BigInteger("12"),
    sequenceMask = BigInteger('-1').xor(BigInteger('-1').shiftLeft(sequenceBits)),
    workerIdBits = BigInteger('5'),
    workerIdShift = sequenceBits,
    dataCenterIdBits = BigInteger('5'),
    dataCenterIdShift = sequenceBits.add(workerIdBits),
    timeStampLeftShift = sequenceBits.add(workerIdBits).add(dataCenterIdBits),
    nepoch = BigInteger('1311779587209');

function getId(lastTimestamp, lastSequence, updateNumbers, callback) {
    var timestamp = timestamps.timeGen();

    if (timestamp === lastTimestamp) {
        sequence = lastSequence.add(BigInteger('1')).and(sequenceMask)
        if (sequence === 0) {
            timestamp = timestamps.tillNextMillis(lastTimeStamp);
        }
    } else {
        sequence = BigInteger('0');
    }

    if (timestamp < lastTimestamp) {
        throw {"message":"Clock is going backwards, cannot make a new ID until clock catches up"};
    }

    updateNumbers(timestamp, sequence);
    
    result = BigInteger(timestamp.toString()).subtract(nepoch).shiftLeft(timeStampLeftShift)
              .or(dataCenterId.shiftLeft(dataCenterIdShift)).or(workerId.shiftLeft(workerIdShift)).or(sequence);
    callback(null, result);
    LOG.info(result, Math.floor(Math.random() * 10E9));
}

exports.getId = getId;

