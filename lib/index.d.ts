/// <reference types="node" />
import { EventEmitter } from "events";
import Promise = require("bluebird");
import request = require("request");
import CoreOptions = request.CoreOptions;
export declare class SpotNotification extends EventEmitter {
    private beater;
    private shouldCheckInstanceStatus;
    constructor(_shouldCheckInstanceStatus?: boolean);
    static get requestOpts(): CoreOptions;
    protected heartbeat(): void;
    protected checkStatus(): Promise<any>;
    protected checkSpotStatus(): Promise<any>;
    protected checkInstanceStatus(): Promise<any>;
    instanceId(): Promise<any>;
    start(): void;
    stop(): void;
}
export declare const SpotNotifier: SpotNotification;
