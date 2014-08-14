'use strict';
var _        = require('underscore');
var child    = require('child_process');
var fs       = require('fs');
var inquirer = require('inquirer');
var mkdirp   = require('mkdirp');
var os       = require('os');
var path     = require('path');
var Q        = require('q');
var readline = require('readline');
               require('colors');

// ## Declarations
var api = {};
var licenses = {
  'Apache-2.0': ['name', 'years'],
  'BSD-2-Clause': ['name', 'years'],
  'BSD-3-Clause': ['name', 'years'],
  'CDDL-1.0': [],
  'EPL-1.0': [],
  'GPL-2.0': ['name', 'software', 'description', 'years'],
  'GPL-3.0': ['name', 'software', 'description', 'years'],
  'ISC': ['name', 'email', 'years'],
  'LGPL-2.1': ['name', 'software', 'description', 'years'],
  'LGPL-3.0': [],
  'MIT': ['name', 'email', 'years'],
  'MPL-2.0': [],
};

// ### Intro `lincensr.intro`
// Displays the introduction header.
//
// __Return values__
// * `intro` The introduction text.
var intro = function () {
  return Q.Promise(function (fulfill) {
    var intro = 'Welcome to ' + ('Licensr'.magenta) + '!';
    intro += '\nIf you don\'t know which license is best suited for you visit:'
    intro += '\n * '.grey + 'http://opensource.org/licenses'
    intro += '\n * '.grey + 'http://choosealicense.com/'
    fulfill(intro);
  });
};
api.intro = function (cb) {
  return intro().nodeify(cb);
};


// ### Command
// Run a command in the shell and get the result.
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


// ### Prompt License `lincensr.promptLicense`
// Ask user about the license they want.
//
// __Return values__
// * `licence` A license's name.
var promptLicense = function () {
  return Q.Promise(function (fulfill) {
    var choices = _.keys(licenses);
    inquirer.prompt([{
      type      : 'list',
      name      : 'license',
      message   : 'Which license do you want',
      paginated : true,
      choices   : choices,
      default   : _.indexOf(choices, 'ISC')
    }], function (license) {
      return fulfill(license);
    });
  });
};
api.promptLicense = function (cb) {
  return promptLicense().nodeify(cb);
};

// ### Prompt Info `lincensr.promptInfo`
// Ask user about information required by the license.
//
// __Arguments__
// * `license` A license's name.
// * `infoDefault` Default values issued by a previous command.
//
// __Return values__
// * `answers` Information about the user.
var promptInfo = function (license, infoDefault) {

  if (infoDefault === undefined) {
    infoDefault = {
      name : undefined,
      email: undefined
    };
  }

  return Q.Promise(function (fulfill) {
    var needed    = licenses[license];
    var questions = [];
    // What's your name?
    if (_.contains(needed, 'name')) {
      questions.push({
        type    : 'input',
        name    : 'name',
        message : 'What\'s your name',
        default : infoDefault.name || 'John Doe',
        validate: function (name) {
          return (name.trim().length === 0) ? 'Your name is required' : true;
        }
      });
    }
    // What's your email?
    if (_.contains(needed, 'email')) {
      questions.push({
        type    : 'input',
        name    : 'email',
        message : 'What\'s your email',
        default : infoDefault.email || 'johndoe@acme.org',
        validate: function (email) {
          return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false)
            ? 'Enter a valid email'
            : true;
        }
      });
    }
    // What's the name of your app?
    if (_.contains(needed, 'software')) {
      questions.push({
        type    : 'input',
        name    : 'software',
        message : 'What\'s the name of your app',
        default : path.basename(path.resolve('.')),
        validate: function (software) {
          return (software.trim().length === 0) ? 'A name is required' : true;
        }
      });
    }
    // Write a brief description of your app
    if (_.contains(needed, 'description')) {
      questions.push({
        type    : 'input',
        name    : 'description',
        message : 'Write a brief description of your app',
        validate: function (description) {
          return (description.trim().length === 0)
            ? 'A description is required'
            : true;
        }
      });
    }
    // On which years does it apply?
    if (_.contains(needed, 'years')) {
      questions.push({
        type    : 'input',
        name    : 'years',
        message : 'On which years does it apply',
        default : new Date().getFullYear(),
        validate: function (years) {
          return (/^\d{4}(-\d{4})?$/.test(years) === false)
            ? 'Enter a four digit year or an range of years'
            : true;
        }
      });
    }
    // Where do you want to save the file?
    questions.push({
      type    : 'input',
      name    : 'file',
      message : 'Where do you want to save the file',
      default : './LICENSE',
    });
    inquirer.prompt(questions, function (answers) {
      return fulfill(answers);
    });
  });
};
api.promptInfo = function (license, infoDefault, cb) {
  return promptInfo(license, infoDefault).nodeify(cb);
};

// ### Write
// Write the license.
//
// __Arguments__
// * `data` The summary fo needed data.
//
// __Return values__
// * `err` If there is any error.
// * `content` Your pimped license!
var write = function (data) {
  return Q.Promise(function (fulfill, reject) {
    var lics = fs.readdirSync(path.resolve(__dirname, 'licenses'));
    if (!_.contains(lics, data.license)) {
      return reject(new Error('Wrong license name'));
    }
    var read = path.resolve(__dirname, 'licenses', data.license);
    var txt = fs.readFileSync(read).toString();
    txt = txt.replace(/%NAME%/g, data.name);
    txt = txt.replace(/%EMAIL%/g, data.email);
    txt = txt.replace(/%SOFTWARE%/g, data.software);
    txt = txt.replace(/%DESCRIPTION%/g, data.description);
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
