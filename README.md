Licensr
=======

License your projects with a nice CLI tool!

[![ruche logo](https://raw.githubusercontent.com/quentinrossetti/licensr/master//assets/animated.gif)](https://github.com/quentinrossetti/licensr)

Usage
---

Just run `licensr` an follow the guide!

You can also use *Licensr* as a node module. You can use super greats 
*Promises* or you can stick with the node's callbacks.

```js
var licensr = require('licensr');
licensr.command('git config --get user.name')
  .then(function (username) {
    // on fulfill
    console.log(username);
  }, function (err) {
    // on reject
    console.error(err);
  });
```


Installation
---

Configure your git environement and install *Licensr* as global node module.


```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
npm install -g licensr
```
