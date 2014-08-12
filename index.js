#!/usr/bin/env node
'use strict';
var child    = require('child_process');
var fs       = require('fs');
var path     = require('path');
var Q        = require('q');
var readline = require('readline');
               require('colors');
var api      = {};
// ## Declarations

// ### Intro
// Displays the introduction header.
var intro = function() {
  return Q.Promise(function (fulfill) {
    process.stdout.write('Welcome to ');
    process.stdout.write('Licensr'.magenta);
    process.stdout.write('!\n');
    fulfill();
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
    var q = 'Choose a ' + topic + ' ' + ('[' + fallback + ']').cyan + '> ';
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
  return Q.Promise(function (fulfill) {
    var read = path.resolve(__dirname, 'lic', data.license.toLowerCase());
    var txt = fs.readFileSync(read).toString();
    txt = txt.replace(/%NAME%/g, data.name);
    txt = txt.replace(/%EMAIL%/g, data.email);
    txt = txt.replace(/%YEARS%/g, data.years);
    fs.writeFileSync(path.resolve(data.file), txt);
    return fulfill(txt);
  });
};
api.write = function (data, cb) {
  return write(data).nodeify(cb);
};

module.exports = api;

// ## Runtime
var data = {
  name   : 'John Doe',
  email  : 'johndoe@example.com',
  license: 'ISC',
  years  : new Date().getFullYear(),
  file   : './LICENSE'
};
intro()
  .then(function () {
    return command('git config --get user.name');
  })
  .then(function (o) {
    data.name = o;
    return command('git config --get user.email');
  })
  .then(function (o) {
    data.email = o;
    return prompt('name', data.name);
  })
  .then(function (name) {
    data.name = name;
    return prompt('email', data.email);
  })
  .then(function (email) {
    data.email = email;
    return prompt('license', data.license);
  })
  .then(function (license) {
    data.license = license;
    return prompt('years', data.years);
  })
  .then(function (years) {
    data.years = years;
    return prompt('file', data.file);
  })
  .then(function (file) {
    data.file = file;
    return write(data);
  })
  .then(function (content) {
    console.log(content);
  });