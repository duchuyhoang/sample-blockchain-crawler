"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseIntervalWorker = void 0;
class BaseIntervalWorker {
    constructor() {
        this.nextTickTime = 3000;
        this.processingTimeout = 6000;
        this.isStopped = false;
    }
    getProcessingTimeout() {
        return this.processingTimeout;
    }
    getNextTickTime() {
        return this.nextTickTime;
    }
    setNextTickTime(time) {
        this.nextTickTime = time;
    }
    setProcessingTimeout(time) {
        this.processingTimeout = time;
    }
    stop() {
        this.isStopped = true;
    }
    start() {
        this.prepare()
            .then(() => {
            this.onTick();
        })
            .catch((e) => {
            console.log(e);
            console.log(`${this.constructor.name} prepare failed`);
        });
    }
    onTick() {
        if (this.isStopped) {
            return;
        }
        const timer = setTimeout(() => {
            console.log(`${this.constructor.name} time out!`);
            process.exit(1);
        }, this.getProcessingTimeout());
        this.doProcess()
            .then(() => {
            if (this.isStopped)
                return;
            clearTimeout(timer);
            setTimeout(() => {
                this.onTick();
            }, this.getNextTickTime());
        })
            .catch((e) => {
            console.log(e);
            if (this.isStopped)
                return;
            clearTimeout(timer);
            setTimeout(() => {
                this.onTick();
            }, this.getNextTickTime());
        });
    }
}
exports.BaseIntervalWorker = BaseIntervalWorker;
