import {SpotNotifier as spot} from "../lib/index";

spot.start();

spot.once("termination", date => {
    console.log("termination", date);
});
spot.once("termination-cancelled", date => {
    console.log("termination-cancelled", date);
});
spot.on("termination-not-detected", error => {
    console.log("termination-not-detected", error);
});

spot.instanceId()
    .then(id => {
        console.log("instanceId", id);
    })
    .catch(err => {
        console.error("instanceId", err);
    });