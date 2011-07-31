//Load Config
var config = require("./config.js");

//LOGging
var LOG = require("./lib/utils/log.js");


//Load dependencies
var idworker = require("./lib/idworker.js");

//Startup Info
LOG.info('NodeFlake Server running on port ' + config.port);
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);

//Local variables
var worker = idworker.getIdWorker(config.workerId, config.dataCenterId);

//Listen for socket connections and respond
var io = require("socket.io");
LOG.info("Socket set up, version " + io.version);
try {
    io.listen(config.port, {'try multiple transports': true});
} catch (err) {
    LOG.error("Could not start socket listener.", err);
    process.exit(1);
}

io.sockets.on('connection', function (socket) {
    try {
        //TODO can you get the UA from sockets?
        var nextId = worker.getId("socket.io web socket");
        socket.emit('response', {id:nextId})
    } catch(err) {
        LOG.error("Failed to return id");
        socket.emit('response', {error:err});
    } finally {
        socket.disconnect();
    }
});