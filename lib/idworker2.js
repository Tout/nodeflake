var LOG = require("./utils/log.js");
var BigInteger = require("bigdecimal").BigInteger;
var config = require("./config.js");
var timestamps = require('./timestamp.js')

// Set Some variables
var workerId = BigInteger(config.workerId);
var dataCenterId = BigInteger(config.dataCenterId);
var sequenceBits = BigInteger("12", );
var sequenceMask = BigInteger('-1').xor(BigInteger('-1').leftShift(sequenceBits));
 
var workerIdBits = BigInteger('5');
var workerIdShift = sequenceBits;
 
var dataCenterIdBits = BigInteger('5');
var dataCenterIdShift = sequenceBits + workerIdBits;
 
var timeStampLeftShift = sequenceBits + workerIdBits + dataCenterIdBits;
 
var nepoch = BigInteger('1311779587209');

// These are the ones we need to persist across a server... hmmmm this means we 
// can not run multiple processes of this on the same server.
var lastTimeStamp = BigInteger('-1');
var sequence = BigInteger('0');

function getId(c, lastTimeStamp, sequence, updateNumbers) {
    var timestamp = timestamps.timeGen();

    if (timestamp === lastTimeStamp) {
        sequence = sequence.add(BigInteger('1')).and.(sequenceMask)
        if (sequence === 0) {
            timestamp = timestamps.tillNextMillis(this.lastTimeStamp);
        }
    } else {
        sequence = BigInteger('0');
    }

    if (timestamp < lastTimeStamp) {
        throw {"message":"Clock is going backwards, cannot make a new ID until clock catches up"};
    }

    updateNumbers(timestamp, sequence);
    
    result = BigInteger(timestamp.toString()).subtract(nepoch).shiftLeft(timeStampLeftShift)
              .or(dataCenterId.shiftLeft(dataCenterIdShift)).or(workerId.shiftLeft(workerIdShift)).or(sequence);
    c.write(result);
    LOG.info(result, Math.floor(Math.random() * 10E9));
}

exports.getId = getId;

