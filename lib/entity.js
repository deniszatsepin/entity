var EventEmitter2 = require('eventemitter2').EventEmitter2;
var _ = require('lodash');

/**
 * Entity, basic element in rotor-web engine.
 * @param {object} param
 * @param {string} param.name - Entity name. If undefined, name will be 'Entity:id'
 * @constructor
 */
function Entity(param) {
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

  this._children = [];
  this._components = [];
  this._parent = null;
};

proto.hasParent = function() {
  return this._parent !== null;
};

/**
 * Return parent entity
 */
proto.getParent = function() {
  return this._parent;
};

/**
 * add child entity
 * @param {Entity} child - The entity that will be the child of current entity.
 */
proto.addChild = function(child) {
  if (this === child) {
    throw new Error(Entity.ERRORS.get(100));
  }
  if (child.hasParent()) {
    if (child.getParent() !== this) {
      throw new Error(Entity.ERRORS.get(102));
    } else {
      throw new Error(Entity.ERRORS.get(101));
    }
  }
  var idx = this._children.indexOf(child);
  if (idx >= 0) {
    throw new Error(Entity.ERRORS.get(101));
  } else {
    this._children.push(child);
    child._parent = this;
  }
};

/**
 * remove child entity
 * @param {Entity} child - The entity that will be remove from current entity children.
 */
proto.removeChild = function(child) {
  if (typeof child === 'undefined') return;

  var idx = this._children.indexOf(child);
  if (idx >= 0) {
    this._children.splice(idx, 1);
    child._parent = null;
  }
};

proto.removeChildren = function() {
  _.each(this._children, function(child) {
    child._parent = null;
  });
  this._children = [];
};

proto.updateChildren = function() {
  _.each(this._children, function(child) {
    child.update();
  });
};

proto.update = function() {
  this.updateComponents();
  this.updateChildren();
};

proto.addComponent = function() {
};

proto.removeComponent = function() {
};

proto.updateComponents = function() {

};

Entity.ERRORS = {
  '100': 'Entity couldn\'t be a child of itself',
  '101': 'Entity already has this child',
  '102': 'Child entity already added to another parent',
  get: function(code) {
    return this[Math.abs(code) + ''];
  }
};

module.exports = Entity;
