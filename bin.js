#!/usr/bin/env node
'use strict';
var api = require('./index');

// ## Runtime
var data = {
  name   : 'John Doe',
  email  : 'johndoe@example.com',
  license: 'ISC',
  years  : new Date().getFullYear(),
  file   : './LICENSE'
};
api.intro()
  .then(function () {
    return api.command('git config --get user.name');
  })
  .then(function (o) {
    data.name = o;
    return api.command('git config --get user.email');
  })
  .then(function (o) {
    data.email = o;
    return api.prompt('name', data.name);
  })
  .then(function (name) {
    data.name = name;
    return api.prompt('email', data.email);
  })
  .then(function (email) {
    data.email = email;
    return api.prompt('license', data.license);
  })
  .then(function (license) {
    data.license = license;
    return api.prompt('years', data.years);
  })
  .then(function (years) {
    data.years = years;
    return api.prompt('file', data.file);
  })
  .then(function (file) {
    data.file = file;
    return api.write(data);
  })
  .then(function (content) {
    console.log(content);
  });