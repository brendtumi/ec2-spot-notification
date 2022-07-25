"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotNotifier = exports.SpotNotification = void 0;
var events_1 = require("events");
var Promise = require("bluebird");
var request = require("request");
var moment = require("moment");
var url_1 = require("url");
var timers_1 = require("timers");
var SpotNotification = /** @class */ (function (_super) {
    __extends(SpotNotification, _super);
    function SpotNotification(_shouldCheckInstanceStatus) {
        if (_shouldCheckInstanceStatus === void 0) { _shouldCheckInstanceStatus = false; }
        var _this = _super.call(this) || this;
        _this.shouldCheckInstanceStatus = _shouldCheckInstanceStatus;
        return _this;
    }
    Object.defineProperty(SpotNotification, "requestOpts", {
        get: function () {
            return {
                baseUrl: (0, url_1.format)({
                    protocol: "http",
                    slashes: true,
                    host: "169.254.169.254",
                    pathname: "latest/meta-data"
                }),
                timeout: 2000,
            };
        },
        enumerable: false,
        configurable: true
    });
    SpotNotification.prototype.heartbeat = function () {
        var _this = this;
        var now = moment().add(1, "minute");
        this.checkStatus()
            .then(function (_a) {
            var terminationTime = _a[0], instanceStatus = _a[1];
            if (terminationTime.isValid() && terminationTime.isSameOrAfter(now)) {
                // Termination scheduled
                _this.emit("termination", terminationTime);
            }
            else {
                // Termination cancelled
                _this.emit("termination-cancelled", terminationTime);
            }
            if (instanceStatus === "Terminated") {
                _this.emit("instance-termination", instanceStatus);
            }
        })
            .catch(function (error) {
            // No termination process
            _this.emit("termination-not-detected", error);
        });
    };
    SpotNotification.prototype.checkStatus = function () {
        var jobs = [
            this.checkSpotStatus()
        ];
        if (this.shouldCheckInstanceStatus) {
            jobs.push(this.checkInstanceStatus());
        }
        return Promise.all(jobs);
    };
    SpotNotification.prototype.checkSpotStatus = function () {
        return new Promise(function (resolve, reject) {
            request.get("spot/termination-time", SpotNotification.requestOpts, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // TODO: check value is date string or not
                    resolve(moment(body));
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    };
    SpotNotification.prototype.checkInstanceStatus = function () {
        return new Promise(function (resolve, reject) {
            request.get("autoscaling/target-lifecycle-state", SpotNotification.requestOpts, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(String(body));
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    };
    SpotNotification.prototype.instanceId = function () {
        return new Promise(function (resolve, reject) {
            request.get("instance-id", SpotNotification.requestOpts, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    };
    SpotNotification.prototype.start = function () {
        var _this = this;
        this.beater = setInterval(function () {
            _this.heartbeat();
        }, 5000);
    };
    SpotNotification.prototype.stop = function () {
        if (this.beater) {
            (0, timers_1.clearInterval)(this.beater);
        }
    };
    return SpotNotification;
}(events_1.EventEmitter));
exports.SpotNotification = SpotNotification;
exports.SpotNotifier = new SpotNotification();
