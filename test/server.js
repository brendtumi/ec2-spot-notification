"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../lib/index");
index_1.SpotNotifier.start();
index_1.SpotNotifier.once("termination", function (date) {
    console.log("termination", date);
});
index_1.SpotNotifier.once("termination-cancelled", function (date) {
    console.log("termination-cancelled", date);
});
index_1.SpotNotifier.on("termination-not-detected", function (error) {
    console.log("termination-not-detected", error);
});
index_1.SpotNotifier.instanceId()
    .then(function (id) {
    console.log("instanceId", id);
})
    .catch(function (err) {
    console.error("instanceId", err);
});
