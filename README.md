Licensr
=======

License your projects with a nice CLI tool!

[![Dependencies Status][gemnasium-image]][gemnasium-url] [![Build Status][travis-image]][travis-url] [![Code quality][codeclimate-image]][codeclimate-url] [![Release][npm-image]][npm-url]

[![ruche logo](https://raw.githubusercontent.com/quentinrossetti/licensr/master//assets/animated.gif)](https://github.com/quentinrossetti/licensr)

Usage
---

Just run `licensr` an follow the guide!

If you choose to use *Licensr* as a node module you can use super greats
*Promises* or you can stick with the node's callbacks, it is you choice.

```js
var licensr = require('licensr');

// Super cool Promise-style
licensr.command('git config --get user.name')
  .then(function (username) {
    // on fulfill
    console.log(username);
  }, function (err) {
    // on reject
    console.error(err);
  });

// Callback-style
licensr.command('git config --get user.name', function (err, username) {
  if (err) { return console.error(err); }
  console.log(username);
});

```

Installation
---

Configure your git environement and install *Licensr* as global node module.

> *Git* is not a requirement but it will autocomplete fields for you!

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
npm install -g licensr
```

API
---

### Intro `lincensr.intro`
Displays the introduction header.

__Return values__
* `intro` The introduction text.

### Command
Run a command in the shell and get the result.

__Arguments__
* `cmd` The command to run.

__Return values__
* `stdout` The result of the command.
* `err` The error as issued by `child_process.exec`.

### Prompt License `lincensr.promptLicense`
Ask user about the license they want.

__Return values__
* `licence` A license's name.

### Prompt Info `lincensr.promptInfo`
Ask user about information required by the license.

__Arguments__
* `license` A license's name.
* `infoDefault` Default values issued by a previous command.

__Return values__
* `answers` Information about the user.

### Write
Write the license.

__Arguments__
* `data` The summary fo needed data.

__Return values__
* `err` If there is any error.
* `content` Your pimped license!

***
With :heart: from [quentinrossetti](https://github.com/quentinrossetti)

[gemnasium-url]: https://gemnasium.com/quentinrossetti/licensr
[gemnasium-image]: http://img.shields.io/gemnasium/quentinrossetti/licensr.svg
[travis-url]: https://travis-ci.org/quentinrossetti/licensr
[travis-image]: http://img.shields.io/travis/quentinrossetti/licensr.svg
[codeclimate-url]: https://codeclimate.com/github/quentinrossetti/licensr
[codeclimate-image]: http://img.shields.io/codeclimate/github/quentinrossetti/licensr.svg
[coveralls-url]: https://coveralls.io/r/quentinrossetti/licensr
[coveralls-image]: http://img.shields.io/coveralls/quentinrossetti/licensr.svg
[npm-url]: https://www.npmjs.org/package/licensr
[npm-image]: http://img.shields.io/npm/v/licensr.svg
