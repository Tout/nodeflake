#!/usr/bin/env node

var haibu = require('haibu'),
    eyes = require('eyes');
    
var app = {
    "user": "kris",
    "name": "nodeflake",
    "domain": "tout.com",
    "repository": {
      "type": "git",
      "url": "http://github.com/Tout/nodeflake.git"
    },
    "scripts": {
      "start": "nodeflake.js"
    }
};

var client = new haibu.drone.Client({
  host: 'localhost',
  port: 9002
});

client.start(app, function (err, result) {
  if (err) {
    console.log('Error spawning app: ' + app.name);
    return eyes.inspect(err);
  }

  console.log('Successfully spawned app:');
  eyes.inspect(result);
});
