//Load Dependencies and Config
var net = require('net'),
    http = require("http"),
    url = require("url"),
    config = require("./config.js"),
    LOG = require("./lib/utils/log.js"),
    idworker = require("./lib/idworker.js"),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0');

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

if(config.sockFile != '') {
    //Listen for socket connections and respond
    try {
        var server = net.createServer(config.sockFile, function (c) {
          try {
              //TODO can you get the UA from sockets?
              var nextId = null;
              idworker.getId(lastTimestamp, lastSequence, function(timestamp, sequence) {
                  lastTimestamp = timestamp;
                  lastSequence = sequence;
              },
              function (err, nextId) {
                  if (err) {
                      c.write('');
                      server.close();
                  } else {
                      c.write("'" + nextId + "'");
                  }
              });
          } catch(err) {
              LOG.error("Failed to return id");
              c.write("'" + nextId + "'");
              server.close();
          }
        });
        server.listen('/tmp/nodeflake.sock', function () {
          console.log('server bound');
        });
    } catch (err) {
        LOG.error("Could not start socket server.", err);
        process.exit(1);
    }
} else if(config.tcpSockets) {
    try {
        var server = net.createServer(function(c) { //'connection' listener
              try {
                  //TODO can you get the UA from sockets?
                  var nextId = null;
                  idworker.getId(lastTimestamp, lastSequence, function(timestamp, sequence) {
                      lastTimestamp = timestamp;
                      lastSequence = sequence;
                  },
                  function (err, nextId) {
                      if (err) {
                          c.write('');
                          server.close();
                      } else {
                          c.write("'" + nextId + "'");
                      }
                  });
              } catch(err) {
                  LOG.error("Failed to return id");
                  c.write("'" + nextId + "'");
                  server.close();
              }
              console.log('server connected');
              c.on('end', function() {
                  console.log('server disconnected');
              });
              c.pipe(c);
          }).listen(config.port, function () {
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
                idworker.getId(lastTimestamp, lastSequence, function (timestamp, sequence) {
                    lastTimestamp = timestamp;
                    lastSequence = sequence;
                },
                function (err, result) {
                    if (err) {
                        LOG.error("Failed to return id");
                        res.end(wrappedResponse("{\"err\":" + err + "}"));
                    } else {
                        res.end(wrappedResponse("{\"id\":\"" + nextId + "\"}"));
                    }
                });
            } catch(err) {
                LOG.error("Failed to return id");
                res.end(wrappedResponse("{\"err\":" + err + "}"));
            }
        }
    }).listen(config.port);
}
