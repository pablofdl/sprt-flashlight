#!/usr/bin/env node

/*
 * @version 0.3, 3 June 2014
 */

var ElasticSearch = require('elasticsearch'),
   conf          = require('./config'),
   fbutil        = require('./lib/fbutil'),
   PathMonitor   = require('./lib/PathMonitor'),
   SearchQueue   = require('./lib/SearchQueue');

// connect to ElasticSearch
var esc = new ElasticSearch.Client({
  hosts: [
    {
      host: conf.ES_HOST,
      port: conf.ES_PORT,
      auth: (conf.ES_USER && conf.ES_PASS) ? conf.ES_USER + ':' + conf.ES_PASS : null
    }
  ]
 });
console.log('Connected to ElasticSearch host %s:%s'.grey, conf.ES_HOST, conf.ES_PORT);

fbutil.auth(conf.FB_URL, conf.FB_TOKEN).done(function() {
   PathMonitor.process(esc, conf.FB_URL, conf.paths, conf.FB_PATH);
   SearchQueue.init(esc, conf.FB_URL, conf.FB_REQ, conf.FB_RES, conf.CLEANUP_INTERVAL);
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + port )
});
