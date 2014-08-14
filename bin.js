#!/usr/bin/env node
'use strict';
require('colors');
var api  = require('./index');
var path = require('path');
var _    = require('underscore');

var data = {};
var infoDefault = {};

api.intro()

  .then(function (intro) {
    console.log(intro);

    // Get defaults
    api.command('git config --get user.name')
    .then(function (name) {
      infoDefault.name = name;
      return api.command('git config --get user.email');
    })
    .then(function (email) {
      infoDefault.email = email;
    })
    .catch(function (err) {
      infoDefault.name = null;
      infoDefault.email = null;
      console.error('Warning: '.yellow + 'You should install git!');
    });

    return api.promptLicense();
  })

  .then(function (answer) {
    data.license = answer.license;
    return api.promptInfo(answer.license, infoDefault);
  })

  .then(function (info) {
    data.name        = info.name;
    data.email       = info.email;
    data.software    = info.software;
    data.description = info.description;
    data.years       = info.years;
    data.file        = info.file;
    return api.write(data);
  })

  .then(function (license) {
    if (license.split('\n').length < 35) {
      console.log('\n--------\n'.grey);
      console.log(license);
      console.log('--------\n'.grey);
    }

    var warns = [ 'LGPL-2.1' ];
    if (_.contains(warns, data.license)) {
      console.error('Warning: '.yellow + 'More informations are required by\
the license. You should check them at the bottom of the file.');
    }

    console.log('License saved to: %s', path.resolve(data.file).green);
  })

  .catch(function (err) {
    console.log('Error: '.red + err.message);
  });
