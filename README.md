# EC2 Spot Instance Termination Notifier
AWS EC2 Spot Instance Termination Notices for NodeJs

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency Status][dependency-image]][dependency-url]

### Installation
Install with [npm](http://github.com/isaacs/npm):
```bash
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

#### Test
```bash
ubuntu@ip-172-31-2-186:~/ec2-spot-notification$ npm run test-server
instanceId i-05858013e
termination-not-detected 404
termination-not-detected 404
termination moment("2017-02-08T12:49:14.000")
termination moment("2017-02-08T12:49:14.000")
termination moment("2017-02-08T12:49:14.000")
termination moment("2017-02-08T12:49:14.000")

Broadcast message from root@ip-172-31-2-186
	(unknown) at 12:49 ...

```

#### My boss wants a license. So where is it?
[MIT License](./LICENSE)

[dependency-image]: https://david-dm.org/brendtumi/ec2-spot-notification.svg?style=flat-square
[downloads-image]: http://img.shields.io/npm/dm/ec2-spot-notification.svg?style=flat-square
[npm-image]: https://img.shields.io/npm/v/ec2-spot-notification.svg?style=flat-square
[dependency-url]: https://david-dm.org/brendtumi/ec2-spot-notification
[npm-url]: https://npmjs.org/package/ec2-spot-notification