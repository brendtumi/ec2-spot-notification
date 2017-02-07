# EC2 Spot Instance Termination Notifier
AWS EC2 Spot Instance Termination Notices for NodeJs

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency Status][dependency-image]][dependency-url]

### Installation
Install with [npm](http://github.com/isaacs/npm):
```
npm install --save ec2-spot-notification
```

### Example
```javascript
const SpotNotification = require("ec2-spot-notification");
let spot = SpotNotification.SpotNotifier;

spot.on("termination", function (date) {
    console.log("termination", date);
});
spot.on("termination-cancelled", function (date) {
    console.log("termination-cancelled", date);
});
spot.on("termination-not-detected", function (error) {
    console.log("termination-not-detected", error);
});

spot.instanceId()
    .then(function (id) {
        console.log("instanceId", id);
    })
    .catch(function (err) {
        console.error("instanceId", err);
    });
```

#### My boss wants a license. So where is it?
[MIT License](./LICENSE)

[dependency-image]: https://david-dm.org/brendtumi/ec2-spot-notification.svg
[downloads-image]: http://img.shields.io/npm/dm/ec2-spot-notification.svg
[npm-image]: https://img.shields.io/npm/v/ec2-spot-notification.svg
[dependency-url]: https://david-dm.org/brendtumi/ec2-spot-notification
[npm-url]: https://npmjs.org/package/ec2-spot-notification