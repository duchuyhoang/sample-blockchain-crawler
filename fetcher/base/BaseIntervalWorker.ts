export abstract class BaseIntervalWorker {
  private nextTickTime: number = 3000;
  private processingTimeout: number = 6000;
  private isStopped: boolean = false;

  public getProcessingTimeout() {
    return this.processingTimeout;
  }

  public getNextTickTime() {
    return this.nextTickTime;
  }

  public setNextTickTime(time: number) {
    this.nextTickTime = time;
  }

  public setProcessingTimeout(time: number) {
    this.processingTimeout = time;
  }
  public stop() {
    this.isStopped = true;
  }

  public start(): void {
    this.prepare()
      .then(() => {
        this.onTick();
      })
      .catch((e) => {
        console.log(e);
        console.log(`${this.constructor.name} prepare failed`);
      });
  }

  private onTick() {
    if (this.isStopped) {
      return;
    }
    const timer = setTimeout(() => {
      console.log(`${this.constructor.name} time out!`);
      process.exit(1);
    }, this.getProcessingTimeout());
    this.doProcess()
      .then(() => {
        if (this.isStopped) return;
        clearTimeout(timer);
        setTimeout(() => {
          this.onTick();
        }, this.getNextTickTime());
      })
      .catch((e) => {
        console.log(e);
        if (this.isStopped) return;
        clearTimeout(timer);
        setTimeout(() => {
          this.onTick();
        }, this.getNextTickTime());
      });
  }

  protected abstract prepare(): Promise<void>;
  protected abstract doProcess(): Promise<void>;
}
