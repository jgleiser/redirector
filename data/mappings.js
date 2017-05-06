'use strict';

var path = require('path');

var Datastore = require('nedb');

var db = {
  mappings: new Datastore({ filename: path.join(__dirname, 'mappings.db'), autoload: true })
};

db.mappings.ensureIndex({ fieldName: 'alias', unique: true }, function (err) {
  if (err) { console.log("Error at creating unique index for alias"); }
});

var mappings = {
  create: function (alias, url, callback) {
    db.mappings.insert({ alias: alias, url: url }, callback);
  },
  
  list: function (callback) {
    db.mappings.find({}).sort({ alias: 1 }).exec(callback);
  },
  
  get: function (alias, callback) {
    db.mappings.findOne({ alias: alias }, function (err, mapping) {
      if (err || !mapping) { return callback(new Error('Alias not found.')); }
      callback(null, mapping.url);
    });
  },
  
  update: function (alias, url, callback) {
    db.mappings.update({ alias: alias }, { alias: alias, url: url }, {}, callback);
  },
  
  remove: function (alias, callback) {
    db.mappings.remove({alias: alias}, callback);
  }
};

module.exports = mappings;
