/* global describe, it */
'use strict';
var expect = require('chai').expect;
var licensr = require('../index');
var fixture = {
  mute: function () {},
  unmute: process.stdout.write
};

describe('API unit tests: intro', function() {

  it('should get a friendly message', function (done) {
    licensr.intro().then(function (message) {
      expect(message).to.be.a('string');
      expect(message.substr(0, 7)).to.eql('Welcome');
      done();
    });
  });

});

describe('API unit tests: prompt', function() {

  it('should responds on user input', function (done) {
    process.stdout.write = fixture.mute;
    process.nextTick(function() {
      process.stdin.emit('data', 'answer\n');
    });
    licensr.prompt('question', 'default').then(function (answer) {
      process.stdout.write = fixture.unmute;
      expect(answer).to.eql('answer');
      done();
    });
  });

  it('should responds with default on empty user input', function (done) {
    process.stdout.write = fixture.mute;
    process.nextTick(function() {
      process.stdin.emit('data', '  \n');
    });
    licensr.prompt('question', 'default').then(function (answer) {
      process.stdout.write = fixture.unmute;
      expect(answer).to.eql('default');
      done();
    });
  });

});

describe('API unit tests: command', function() {

  it('should get an error on invalid command', function (done) {
    licensr.command('¤').then(null, function (err) {
      expect(err.message).to.contain('Command failed');
      done();
    });
  });

  it('should get stdout as value', function (done) {
    var cmd = (process.platform === 'win32') ? 'dir' : 'ls';
    licensr.command(cmd).then(function (output) {
      expect(output).to.be.a('string');
      done();
    });
  });

});

describe('API unit tests: write', function() {

  it('should get an error on invalid license name', function (done) {
    licensr.write({ license: '???' }).then(null, function (err) {
      expect(err.message).to.contain('Wrong license name');
      done();
    });
  });

  it('should get an error on invalid path', function (done) {
    var data = {
      license: 'ISC',
      file   : 'D:/lic'
    };
    licensr.write(data).then(null, function (err) {
      expect(err.message).to.be.a('string');
      done();
    });
  });

  it('should get an error on invalid filename', function (done) {
    var data = {
      license: 'ISC',
      file   : 'node_modules'
    };
    licensr.write(data).then(null, function (err) {
      expect(err.code).to.eql('EISDIR');
      done();
    });
  });

  it('should works with valid data', function (done) {
    var data = {
      name   : 'John Doe',
      email  : 'johndoe@example.com',
      years  : '2009-2014',
      license: 'Apache-2.0',
      file   : '.tmp/test/LICENSE'
    };
    licensr.write(data).then(function (license) {
      expect(license).to.be.a('string');
      done();
    });
  });

});