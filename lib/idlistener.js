var LOG = require('./utils/log.js'),
    idworker = require('./idworker2.js');

function listen_for_id(currentTimeSource, writer) {
    try {
        idworker.getId(currentTimeSource['lastTimestamp'], currentTimeSource['lastSequence'], function (timestamp, sequence) {
            currentTimeSource['lastTimestamp'] = timestamp;
            currentTimeSource['lastSequence'] = sequence;
        },
        function (err, result) {
            if (err) {
                LOG.error("Failed to return id" + err);
                writer("err");
                return err;
            } else {
                writer(result.toString());
                return result;
            }
        });
    } catch(err) {
        LOG.error("Exception thrown while returning id" + err);
        writer(err);
        return err;
    }
}
exports.listen_for_id = listen_for_id;