var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
var expect    = chai.expect;
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Entity    = require('../lib/entity');

chai.use(sinonChai);

describe('Entity tests:', function() {
  describe('Entity', function() {
    var entity;
    var Component = function() {
      this._entity = null;
    };
    Component.prototype.getEntity = function() {
      return this._entity;
    };
    Component.prototype.update = function() {};

    before(function() {
      entity = new Entity();
    });

    it('should be inherited from EventEmitter2', function() {
      (entity instanceof EventEmitter2).should.be.equal(true);
    });

    it('should have id param', function() {
      entity.id.should.be.equal(0);
    });

    //Children tests
    it('should have children array', function() {
      ('_children' in entity).should.be.equal(true);
      (entity._children instanceof Array).should.be.equal(true);
    });

    it('couldn\'t add itself as a child', function() {
      var func = entity.addChild.bind(entity, entity);
      expect(func).to.throw(Error);
    });

    it('should add child', function() {
      var child = new Entity();
      entity.addChild(child);
      entity._children.length.should.be.equal(1);
    });

    it('couldn\'t add child twice', function() {
      var child = new Entity();
      entity.addChild(child);
      var func = entity.addChild.bind(entity, child);
      expect(func).to.throw(Error);
    });

    it('should thorow error on adding child that already added to another entity', function() {
      var child = new Entity();
      var anotherParent = new Entity();
      anotherParent.addChild(child);
      var func = entity.addChild.bind(entity, child);
      expect(func).to.throw(Error);
    });

    it('should remove entity if it exists', function() {
      var child = new Entity();
      entity.addChild(child);
      entity.removeChild(child);
      expect(entity._children.indexOf(child)).to.be.below(0);
    });

    it('should set _parent attribute to null, after child has been removed', function() {
      var child = new Entity();
      entity.addChild(child);
      entity.removeChild(child);
      expect(child.hasParent()).to.be.equal(false);
    });

    it('should remove all children', function() {
      for (var i = 0; i < 5; i += 1) {
        (function() {
          var child = new Entity();
          entity.addChild(child);
        })();
      }
      entity._children.length.should.be.above(0);
      entity.removeChildren();
      entity._children.length.should.be.equal(0);
    });

    it('should update all children', function() {
      sinon.spy(Entity.prototype, 'update');
      entity.removeChildren();
      for (var i = 0; i < 10; i += 1) {
        (function() {
          var child = new Entity();
          entity.addChild(child);
          for (var i = 0; i < 2; i += 1) {
            (function() {
              var subChild = new Entity();
              child.addChild(subChild);
            })();
          }
        })();
      }
      entity.update();
      Entity.prototype.update.should.have.callCount(10 + 10 * 2 + 1);
      entity.removeChildren();
      Entity.prototype.update.restore();
    });

    //Component tests
    it('should have componens array', function() {
      ('_components' in entity).should.be.equal(true);
      (entity._components instanceof Array).should.be.equal(true);
    });

    it('should add new components', function() {
      var component = new Component();
      entity.addComponent(component);
      entity._components.length.should.be.above(0);
    });

    it('should not add component that has already been added to other entity', function() {
      var component = new Component();
      var otherEntity = new Entity();
      otherEntity.addComponent(component);

      var func = entity.addComponent.bind(entity, component);
      expect(func).to.throw(Error);
    });

    it('should reject adding one component twice', function() {
      var component = new Component();
      entity.addComponent(component);

      var func = entity.addComponent.bind(entity, component);
      expect(func).to.throw(Error);
    });

    it('should remove one component', function() {
      var component = new Component();
      entity.addComponent(component);
      entity._components.indexOf(component).should.be.at.least(0);
      entity.removeComponent(component);
      entity._components.indexOf(component).should.be.below(0);
    });

    it('removed component should have _entity equal to null', function() {
      var component = new Component();
      entity.addComponent(component);
      entity._components.indexOf(component).should.be.at.least(0);
      entity.removeComponent(component);
      expect(component._entity).to.equal(null);
    });

    it('should clear components', function() {
      var component = new Component();
      entity.addComponent(component);
      entity._components.indexOf(component).should.be.at.least(0);
      entity.clearComponents();
      expect(component._entity).to.equal(null);
      entity._components.length.should.be.equal(0);
    });

    it('should update all components', function() {
      sinon.spy(Component.prototype, 'update');
      (function() {
        for (var i = 0; i < 5; i += 1) {
          var component = new Component();
          entity.addComponent(component);
        }
        var child = new Entity();
        entity.addChild(child);
        for (i = 0; i < 5; i += 1) {
          component = new Component();
          child.addComponent(component);
        }
      })();
      entity.update();
      Component.prototype.update.should.have.callCount(10);
      Component.prototype.update.restore();
    });
  });
});
