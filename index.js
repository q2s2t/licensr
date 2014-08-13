'use strict';
var _        = require('underscore');
var child    = require('child_process');
var fs       = require('fs');
var mkdirp   = require('mkdirp');
var path     = require('path');
var Q        = require('q');
var readline = require('readline');
               require('colors');

// ## Declarations
var api      = {};

// ### Intro
// Displays the introduction header.
var intro = function() {
  return Q.Promise(function (fulfill) {
    var o = 'Welcome to ' + ('Licensr'.magenta) + '!';
    fulfill(o);
  });
};
api.intro = function (cb) {
  return intro().nodeify(cb);
};

// ### Prompt
// Ask user about the license they want.
//
// __Arguments__
// * `topic` The data the prompt is about.
// * `default` A fallback value.
//
// __Return values__
// * `data` What the user gets.
var prompt = function(topic, fallback) {
  return Q.Promise(function (fulfill) {
    var q = topic + ' ' + ('[' + fallback + ']').cyan + '> ';
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(q, function (answer) {
      rl.close();
      if (answer.trim() === '') {
        return fulfill(fallback);
      }
      return fulfill(answer);
    });
  });
};
api.prompt = function (topic, fallback, cb) {
  return prompt(topic, fallback).nodeify(cb);
};

// ### Command
// Run a command in the shell ans get the result.
//
// __Arguments__
// * `cmd` The command to run.
//
// __Return values__
// * `stdout` The result of the command.
// * `err` The error as issued by `child_process.exec`.
var command = function (cmd) {
  return Q.Promise(function (fulfill, reject) {
    child.exec(cmd, function (err, stdout) {
      if (err) {
        return reject(err);
      }
      return fulfill(stdout.split('\n')[0]);
    });
  });
};
api.command = function (cmd, cb) {
  return command(cmd).nodeify(cb);
};
  
// ### Write
// Write the license.
//
// __Arguments__
// * `data` The summary fo needed data.
//
// __Return values__
// * `content` Your pimped license!
var write = function (data) {
  return Q.Promise(function (fulfill, reject) {
    var lics = fs.readdirSync(path.resolve(__dirname, 'lic'));
    if (!_.contains(lics, data.license.toLowerCase())) {
      return reject(new Error('Wrong license name'));
    }
    var read = path.resolve(__dirname, 'lic', data.license.toLowerCase());
    var txt = fs.readFileSync(read).toString();
    txt = txt.replace(/%NAME%/g, data.name);
    txt = txt.replace(/%EMAIL%/g, data.email);
    txt = txt.replace(/%YEARS%/g, data.years);
    mkdirp(path.dirname(path.resolve(data.file)), function (err) {
      if (err) {
        return reject(err);
      }
      fs.writeFile(path.resolve(data.file), txt, function (err) {
        if (err) {
          return reject(err);
        }
        return fulfill(txt);
      });
    });
  });
};
api.write = function (data, cb) {
  return write(data).nodeify(cb);
};

// Expose the API
module.exports = api;
