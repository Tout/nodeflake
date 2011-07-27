//Load Config
var config = require("./config.js");
var LOG = require("./lib/utils/log.js");


//Load dependencies
var http = require('http'),
    redis = require('redis'),
    idworker = require("./lib/idworker.js");


//Startup Info
LOG.info('NodeFlake Server running at http://localhost:1337/');
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);


//Local variables
var redis_client = redis.createClient(),
    worker = idworker.getIdWorker(config.workerId, config.dataCenterId, redis_client);

//Listen for connections
http.createServer(function (req, res) {
  redis_client.incr("nextid", function(err, value) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      if (!err) {
        var nextId = worker.getId(req.headers['user-agent']);
        LOG.info(nextId);
        res.end("{\"id\":\"" + nextId + "\"}\n");
      } else {
        LOG.error("Failed to return id");
        res.end("{\"err\":" + err + "}\n");
      }

  });
}).listen(1337);

