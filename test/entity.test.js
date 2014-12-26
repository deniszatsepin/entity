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
      ('children' in entity).should.be.equal(true);
      (entity.children instanceof Array).should.be.equal(true);
    });

    it('couldn\'t add itself as a child', function() {
      var func = entity.addChild.bind(entity, entity);
      expect(func).to.throw(Error);
    });

    it('should add child', function() {
      var child = new Entity();
      entity.addChild(child);
      entity.children.length.should.be.equal(1);
    });

    it('couldn\'t add child twice', function() {
      var child = new Entity();
      entity.addChild(child);
      var func = entity.addChild.bind(entity, child);
      expect(func).to.throw(Error);
    });

    //Component tests
    it('should have componens array', function() {
      ('components' in entity).should.be.equal(true);
      (entity.components instanceof Array).should.be.equal(true);
    });
  });
});
