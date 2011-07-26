var http = require('http'),
    redis = require('redis'),
    redis_client = redis.createClient();

http.createServer(function (req, res) {
  redis_client.incr("nextid", function(err, value) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      if (!err) {
        var nextId = ((new Date).getTime()).toString(36) + "-" + (value).toString(36);
        console.log(nextId);
        res.end("{\"id\":\"" + nextId + "\"}\n");
      } else {
        res.end("{\"err\":" + err + "}\n");
      }

  });
}).listen(1337, "localhost");

console.log('NodeFlake Server running at http://localhost:1337/');
