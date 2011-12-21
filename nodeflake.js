//Load Dependencies and Config
var net = require('net'),
    http = require("http"),
    url = require("url"),
    config = require("./config.js"),
    LOG = require("./lib/utils/log.js"),
    idworker = require("./lib/idworker.js");

//Startup Info
if(config.sockFile != '') {
  LOG.info('NodeFlake Server running on UNIX socket ' + config.sockFile);
} else if(config.tcpSockets) {
  LOG.info('NodeFlake Server running on TCP port ' + config.port);
} else {
  LOG.info('NodeFlake Server running http on port ' + config.port);
}
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);

//Local variables
var worker = idworker.getIdWorker(config.workerId, config.dataCenterId);

if(config.sockFile != '') {
    //Listen for socket connections and respond
    try {
        var server = net.createServer(config.sockFile, function(c) {
          try {
              //TODO can you get the UA from sockets?
              var nextId = worker.getId("unix socket");
              c.write("{id:" + nextId + "}")
          } catch(err) {
              LOG.error("Failed to return id");
              c.write("'" + nextId + "'");
              server.close();
          }
        });
        server.listen('/tmp/nodeflake.sock', function() {
          console.log('server bound');
        });
    } catch (err) {
        LOG.error("Could not start socket server.", err);
        process.exit(1);
    }
} else if(config.tcpSockets) {
  var server = net.createServer()
} else {
    http.createServer(function (req, res) {
        var urlObj = url.parse(req.url, true);
        if (req.url.indexOf("favicon") > -1) {
            res.writeHead(404, {'Content-Type':'text/plain'});
            res.end("Not Found");
        } else {
            res.writeHead(200, {
                                'Content-Type' : 'text/javascript',
                                'Cache-Control': 'no-cache',
                                'Connection'   : 'close'
                          });
            function wrappedResponse(responseString) {
                if (urlObj.query["callback"]) {
                    return urlObj.query["callback"] + "(" + responseString + ");";
                } else {
                    return responseString;
                }
            }
            try {
                var nextId = worker.getId(req.headers['user-agent']);
                res.end(wrappedResponse("{\"id\":\"" + nextId + "\"}"));
            } catch(err) {
                LOG.error("Failed to return id");
                res.end(wrappedResponse("{\"err\":" + err + "}"));
            }
        }
    }).listen(config.port);
}
