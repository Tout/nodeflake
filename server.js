#!/usr/bin/env node

var haibu = require('haibu'),
    eyes = require('eyes'),
    app = require('./package.json');

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
