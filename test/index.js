var SpotNotification = require("../index");

var spot = SpotNotification.SpotNotifier;

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
/*
 setTimeout(function () {
 process.exit(0);
 }, 20000);
 //*/