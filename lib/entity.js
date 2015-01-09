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
  this._tags = [];
  this._parent = null;
  this._realized = false;

  //links to transform and visual components (to increase performance)
  this._scene = {
    transform: null,
    visual: null
  };
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
    if (this._realized && !child._realized) {
      child.realize();
    }
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

/**
 * remove all children
 */
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

/**
 * Add component to the entity
 * @param {Component} component
 */
proto.addComponent = function(component) {
  if (component.getEntity() !== null) {
    throw new Error(Entity.ERRORS.get(103));
  }
  var idx = this._components.indexOf(component);
  if (idx >= 0) {
    throw new Error(Entity.ERRORS.get(104));
  } else {
    this._components.push(component);
    component._entity = this;
  }
};

/**
 * Remove one component from entity
 * @param {Component} component
 */
proto.removeComponent = function(component) {
  if (typeof component === 'undefined') return;

  var idx = this._components.indexOf(component);
  if (idx >= 0) {
    this._components.splice(idx, 1);
    component._entity = null;
  }
};

/**
 * Remove all components from entity
 */
proto.clearComponents = function() {
  _.each(this._components, function(component) {
    component._entity = null;
  });
  this._components = [];
};

/**
 * Call update method on all components
 */
proto.updateComponents = function() {
  _.each(this._components, function(component) {
    if (typeof component.update === 'function') {
      component.update();
    }
  });
};


/**
 * Realize entity and all his children and components
 */
proto.realize = function() {
  if (this._parent) {
    this._game = this._parent._game;
  }
  this._realizeComponents();
  this._realizeChildren();
  this._realized = true;
};

proto._realizeComponents = function() {
  _.each(this._components, function(component) {
    component.realize();
  });
};

proto._realizeChildren = function() {
  _.each(this._children, function(child) {
    child.realize();
  });
};

proto.getComponentsByType = function(type) {
  _.find(this._components, function(component) {
    if (component.componentType === type) {
      return true;
    }
  });
};

Entity.ERRORS = {
  '100': 'Entity couldn\'t be a child of itself',
  '101': 'Entity already has this child',
  '102': 'Child entity has already been added to the other parent',
  '103': 'This component has already been added to the other entity',
  '104': 'This component has already been added to this entity',
  get: function(code) {
    return this[Math.abs(code) + ''];
  }
};

module.exports = Entity;
