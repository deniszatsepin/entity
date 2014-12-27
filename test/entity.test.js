var chai    = require('chai');
var should  = chai.should();
var expect  = chai.expect;
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Entity  = require('../lib/entity');

describe('Entity tests:', function() {
  describe('Entity', function() {
    var entity;
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
    //Component tests
    it('should have componens array', function() {
      ('_components' in entity).should.be.equal(true);
      (entity._components instanceof Array).should.be.equal(true);
    });
  });
});
