'use strict';

var oo = require('substance/util/oo');
var RemoteEngine = require('../../RemoteEngine');

function SheetRemoteEngine() {
  SheetRemoteEngine.super.apply(this, arguments);

  window._engine = this;
}

SheetRemoteEngine.Prototype = function() {

  this.boot = function(cb) {
    this.request('PUT', 'boot', null, function(err, result) {
      if (err) return cb(err);
      this.active = true;
      cb(null, result);
    }.bind(this));
  };

  this.update = function(cells, cb) {
    this.request('PUT', 'update', cells, function(err, result) {
      if (err) return cb(err);
      cb(null, result);
    });
  };

  this.save = function(html, cb) {
  	console.log('TODO: implement save in SheetRemoteEngine.js');
  };
};

RemoteEngine.extend(SheetRemoteEngine);

module.exports = SheetRemoteEngine;
