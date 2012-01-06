//Load Dependencies and Config
var server = require('./lib/server.js'),
    config = require("./config.js"),
    LOG = require("./lib/utils/log.js");

var currentTimeValues = {
    'lastTimestamp': 0,
    'lastSequence': require('bigdecimal').BigInteger('0')
};

//Startup Info
var server_type,
    binding;
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);

if (config.sockFile !== '') {
    server_type = 'socket';
    binding = config.sockFile;
    LOG.info('Attempting to start NodeFlake Server running on UNIX socket ' + config.sockFile);
} else if (config.tcpSockets === 1) {
    server_type = 'socket';
    binding = config.port;
    LOG.info('Attempting to start NodeFlake Server running on TCP socket port ' + config.port);
} else {
    server_type = 'http';
    binding = config.port;
    LOG.info('Attempting to start NodeFlake Server running http on port ' + config.port);
}

function restart_server(node_server) {
    'use strict';
    node_server.start(server_type, binding, currentTimeValues, function (node_server) {
        node_server.on("close", function (err) {
            if (err) {
                LOG.error("Server stopped on error: " + err);
            }
            restart_server(node_server);
        });
    });
}

try {
    server.start(server_type, binding, currentTimeValues, function (err, node_server) {
        'use strict';
        LOG.info("Server started.");
        node_server.on('close', function (err) {
            LOG.error("Server closed on Error: " + err);
            restart_server(node_server);
        });
    });
} catch (err) {
    LOG.error("Could not start server.", err);
    process.exit(1);
}
