/* global describe, it */
'use strict';
var expect = require('chai').expect;
var licensr = require('../index');

describe('API unit tests: intro', function() {
  it('intro should get a friendly message', function (done) {
    licensr.intro().then(function (message) {
      expect(message).to.be.a('string');
      expect(message.substr(0, 7)).to.eql('Welcome');
      done();
    });
  });
});