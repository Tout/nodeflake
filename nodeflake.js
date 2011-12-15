//Load Config
var config = require("./config.js");

//LOGging
var LOG = require("./lib/utils/log.js");


//Load dependencies
var http = require("http"),
    url = require("url"),
    idworker = require("./lib/idworker.js");

//Startup Info
LOG.info('NodeFlake Server running on port ' + config.port);
LOG.info('Data Center Id:' + config.dataCenterId);
LOG.info('     Worker Id:' + config.workerId);

//Local variables
var worker = idworker.getIdWorker(config.workerId, config.dataCenterId);

if(config.useSockets) {
    //Listen for socket connections and respond
    try {
        var net = require('net')
        var server = net.createServer('/tmp/nodeflake.sock', function(c) {
          try {
              //TODO can you get the UA from sockets?
              var nextId = worker.getId("unix socket");
              c.write("{id:" + nextId + "}")
          } catch(err) {
              LOG.error("Failed to return id");
              c.write("{error:" + err + "}");
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
