var EventEmitter2 = require('eventemitter2').EventEmitter2;
var _ = require('lodash');

function Entity(params) {
  EventEmitter2.apply(this, arguments);
  Entity.prototype.init.apply(this, arguments);
}

Entity.__ids = 0;
Entity.prototype = EventEmitter2.prototype;

var proto = Entity.prototype;

proto.init = function(param) {
  param = param || {};

  this.id = Entity.__ids++;
  this.name = param.name || 'Entity:' + this.id;

  this.children = [];
  this.components = [];
};

/*
 * add child entity
 */
proto.addChild = function(child) {
  if (this === child) {
    throw new Error(Entity.ERRORS.get(100));
  }
  var idx = this.children.indexOf(child);
  if (idx >= 0) {
    throw new Error(Entity.ERRORS.get(101));
  } else {
    this.children.push(child);
  }
};

/*
 * remove child entity
 */
proto.removeChild = function(entity) {
};

proto.addComponent = function() {
};

proto.removeComponent = function() {
};

Entity.ERRORS = {
  '100': 'Entity couldn\'t be a child of itself',
  '101': 'Entity already has this child',
  get: function(code) {
    return this[Math.abs(code) + ''];
  }
};

module.exports = Entity;
