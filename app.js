'use strict';

var http = require('http'),
    path = require('path');

var express = require('express'),
    bodyParser = require('body-parser');;

var logger = require('./logger'),
    mappings = require('./data/mappings');

var app = express();

app.use(logger('redirector'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  mappings.list(function (err, mapps) {
    if (err) { return res.sendStatus(404); }
    res.json(mapps);
  });
});

app.get('/:alias', function (req, res) {
  mappings.get(req.params.alias, function (err, mapping) {
    if (err) { return res.sendStatus(404); }
    res.redirect(mapping);
  });
});

app.post('/:alias', function (req, res) {
  mappings.create(req.params.alias, req.body.url, function (err, mapping) {
    if (err) { return res.sendStatus(400); }
    res.sendStatus(200);
  });
});

app.put('/:alias', function (req, res) {
  mappings.update(req.params.alias, req.body.url, function (err, numUpdated) {
    if (err) { return res.sendStatus(400); }
    if (numUpdated > 0 ) { res.json({'updated': numUpdated}); }
    else { res.sendStatus(404); }
  });
});

app.delete('/:alias', function (req, res) {
  mappings.remove(req.params.alias, function (err, numDeleted) {
    if (err) { return res.sendStatus(404); }
    if (numDeleted > 0) { res.json({'deleted': numDeleted}); }
    else { res.sendStatus(404); }
  });
});

http.createServer(app).listen(3000);
console.log("Listening at port 3000");
