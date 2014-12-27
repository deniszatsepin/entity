var EventEmitter2 = require('eventemitter2').EventEmitter2;
var _ = require('lodash');

/**
 * Entity, basic element in rotor-web engine.
 * @param params
 * @constructor
 */
function Entity(params) {
  EventEmitter2.apply(this, arguments);
  Entity.prototype.init.apply(this, arguments);
}

Entity.__ids = 0;
Entity.prototype = Object.create(EventEmitter2.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: Entity,
    writable: true
  },
  __super: {
    value: EventEmitter2.prototype
  }
});

var proto = Entity.prototype;

proto.init = function(param) {
  param = param || {};

  this.id = Entity.__ids++;
  this.name = param.name || 'Entity:' + this.id;

  this.children = [];
  this.components = [];
};

/**
 * add child entity
 * @param {Entity} child - The entity that will be the child of current entity.
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

/**
 * remove child entity
 * @param {Entity} child - The entity that will be remove from current entity children.
 */
proto.removeChild = function(child) {
  if (typeof child === 'undefined') return;

  var idx = this.children.indexOf(child);
  if (idx >= 0) {
    this.children.splice(idx, 1);
  }
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
