# EC2 Spot Instance Termination Notifier
AWS EC2 Spot Instance Termination Notices for NodeJs

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] 

### Installation
Install with [npm](http://github.com/isaacs/npm):
```bash
npm install --save ec2-spot-notification
```

### Example
```typescript
import {SpotNotifier as spot} from "ec2-spot-notification";

spot.once("termination", date => {
    console.log("termination", date);
});
spot.once("termination-cancelled", date => {
    console.log("termination-cancelled", date);
});
spot.on("termination-not-detected", error => {
    console.log("termination-not-detected", error);
});
spot.on("instance-termination", error => {
    console.log("instance-termination", error);
});

spot.instanceId()
    .then(id => {
        console.log("instanceId", id);
        spot.start();
    })
    .catch(err => {
        console.error("instanceId", err);
    });
```

#### Production usage
```javascript
var SpotNotifier = require("ec2-spot-notification").SpotNotifier;
var aws = require("aws-sdk");

var instanceId = null;
var elb = new aws.ELB();

SpotNotifier.on("termination", function (date) {
    console.log("Aws termination detected", date.toString());

    elb.deregisterInstancesFromLoadBalancer({
        Instances: [{InstanceId: instanceId}],
        LoadBalancerName: "Nutcracker"
    }, function (err, data) {
        if (err)
            console.error("deregisterInstancesFromLoadBalancer", err);
        else {
            console.log("deregisterInstancesFromLoadBalancer", data);
            SpotNotifier.stop();
        }
    });

});
SpotNotifier.on("termination-cancelled", function (date) {
    console.log("Aws termination cancelled for %s, restarting notifier", date.toString());

    SpotNotifier.start();
    elb.registerInstancesWithLoadBalancer({
        Instances: [{InstanceId: instanceId}],
        LoadBalancerName: "Nutcracker"
    }, function (err, data) {
        if (err)
            console.error("deregisterInstancesFromLoadBalancer", err);
        else {
            console.log("deregisterInstancesFromLoadBalancer", data);
        }
    });

});
SpotNotifier.instanceId()
    .then(function (iId) {
        console.log("Aws Spot Notification instanceId", iId);
        instanceId = iId;
        SpotNotifier.start();
    })
    .catch(function (err) {
        console.error("Aws Spot Notification instanceId", err);
    });
```

#### Test
```bash
ubuntu@ip-172-31-2-186:~/ec2-spot-notification$ npm run test-server
instanceId i-05858013e
termination-not-detected 404
termination-not-detected 404
termination-not-detected 404
termination-not-detected 404
termination moment("2017-02-08T12:49:14.000")

Broadcast message from root@ip-172-31-2-186
	(unknown) at 12:49 ...

```

## Contributors
We welcome contributions of all kinds from anyone. 
* Author: [Tümay Çeber](https://github.com/brendtumi)

### My boss wants a license. So where is it?
[MIT License](./LICENSE)

[downloads-image]: http://img.shields.io/npm/dm/ec2-spot-notification.svg?style=flat-square
[npm-image]: https://img.shields.io/npm/v/ec2-spot-notification.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ec2-spot-notification