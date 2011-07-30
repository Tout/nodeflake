//Load Config
var config = require("./config.js");

//LOGging
var LOG = require("./lib/utils/log.js");


//Load dependencies
var http = require('http'),
    idworker = require("./lib/idworker.js");


//Startup Info
LOG.info('NodeFlake Server running on port ' + config.port);
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);


//Local variables
var worker = idworker.getIdWorker(config.workerId, config.dataCenterId);

//Listen for connections
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  try {
    var nextId = worker.getId(req.headers['user-agent']);
    res.end("{\"id\":\"" + nextId + "\"}\n");
  } catch(err) {
    LOG.error("Failed to return id");
    res.end("{\"err\":" + err + "}\n");
  }
}).listen(config.port);

