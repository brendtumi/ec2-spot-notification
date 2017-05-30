/// <reference types="node" />
/// <reference types="request" />
/// <reference types="bluebird" />
import { EventEmitter } from "events";
import Promise = require("bluebird");
import request = require("request");
import CoreOptions = request.CoreOptions;
export declare class SpotNotification extends EventEmitter {
    private beater;
    constructor();
    static readonly requestOpts: CoreOptions;
    protected heartbeat(): void;
    protected checkStatus(): Promise<any>;
    instanceId(): Promise<any>;
    start(): void;
    stop(): void;
}
export declare const SpotNotifier: SpotNotification;
