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
  .then(function (o) {
    console.log(o);
    return api.command('git config --get user.name');
  })
  .then(function (o) {
    data.name = o;
    return api.command('git config --get user.email');
  })
  .then(function (o) {
    data.email = o;
    return api.prompt('What\'s your name?', data.name);
  })
  .then(function (name) {
    data.name = name;
    return api.prompt('What\'s your email?', data.email);
  })
  .then(function (email) {
    data.email = email;
    return api.prompt('Which license do you want?', data.license);
  })
  .then(function (license) {
    data.license = license;
    return api.prompt('On which years?', data.years);
  })
  .then(function (years) {
    data.years = years;
    return api.prompt('Where do you want your file?', data.file);
  })
  .then(function (file) {
    data.file = file;
    return api.write(data);
  })
  .then(function (content) {
    console.log(content);
  })
  .catch(function (err) {
    console.log('Error: '.red + err.message);
  });