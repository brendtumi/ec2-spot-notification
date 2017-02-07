var SpotNotification = require("../index");

var spot = SpotNotification.SpotNotifier;

spot.on("termination", date => {
    console.log("termination", date);
});
spot.on("termination-cancelled", date => {
    console.log("termination-cancelled", date);
});
spot.on("termination-not-detected", error => {
    console.log("termination-not-detected", error);
});

spot.instanceId()
    .then((id) => {
        console.log("instanceId", id);
        process.exit(0);
    })
    .catch((err) => {
        console.error("instanceId", err);
    });

setTimeout(function () {
    process.exit(1);
}, 20000);