import {IncomingMessage} from "http";
import {EventEmitter} from "events";
import Promise = require("bluebird");
import request = require("request");
import moment = require("moment");
import {format} from "url";
import Moment = moment.Moment;
import CoreOptions = request.CoreOptions;
import {clearInterval} from "timers";

export class SpotNotification extends EventEmitter {
    private beater: any;
    private shouldCheckInstanceStatus: boolean;

    constructor(_shouldCheckInstanceStatus:boolean = false) {
        super();
        this.shouldCheckInstanceStatus = _shouldCheckInstanceStatus;
    }

    static get requestOpts(): CoreOptions {
        return {
            baseUrl: format({
                protocol: "http",
                slashes: true,
                host: "169.254.169.254",
                pathname: "latest/meta-data"
            }),
            timeout: 2000,
        };
    }

    protected heartbeat(): void {
        let now = moment().add(1, "minute");
        this.checkStatus()
            .then(([terminationTime, instanceStatus]: [Moment, string]) => {
                if (terminationTime && terminationTime.isValid() && terminationTime.isSameOrAfter(now)) {
                    // Termination scheduled
                    this.emit("termination", terminationTime);
                } else if (terminationTime) {
                    // Termination cancelled
                    this.emit("termination-cancelled", terminationTime);
                }
                if (instanceStatus === "Terminated") {
                    this.emit("instance-termination", instanceStatus);
                }
            })
            .catch((error: Error) => {
                // No termination process
                this.emit("termination-not-detected", error);
            });
    }

    protected checkStatus(): Promise<any> {
        const jobs = [
            this.checkSpotStatus()
        ];
        if (this.shouldCheckInstanceStatus) {
            jobs.push(this.checkInstanceStatus())
        }
        return Promise.all(jobs);
    }

    protected checkSpotStatus(): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get("spot/termination-time", SpotNotification.requestOpts, (error: null|Error, response: IncomingMessage, body: string) => {
                if (!error && response.statusCode === 200) {
                    // TODO: check value is date string or not
                    resolve(moment(body));
                } else if (response.statusCode === 404) {
                    resolve(null);
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    }

    protected checkInstanceStatus(): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get("autoscaling/target-lifecycle-state", SpotNotification.requestOpts, (error: null|Error, response: IncomingMessage, body: string) => {
                if (!error && response.statusCode === 200) {
                    resolve(String(body));
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    }

    public instanceId(): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get("instance-id", SpotNotification.requestOpts, (error: null|Error, response: IncomingMessage, body: string) => {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    }

    public start(): void {
        this.beater = setInterval(() => {
            this.heartbeat();
        }, 5000);
    }

    public stop(): void {
        if (this.beater) {
            clearInterval(this.beater);
        }
    }
}

export const SpotNotifier = new SpotNotification();
