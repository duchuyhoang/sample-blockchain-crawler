import { wrapperAsync } from "../../common/utils";

export default abstract class BaseLauncher {
  constructor() {}
  protected abstract prepare(): Promise<void>;
  protected abstract handleStart(): Promise<void>;
  public async start() {
    const [_, prepareError] = await wrapperAsync(this.prepare());
    if (prepareError) {
      console.log(`${this.constructor.name} cannot prepare`);
      return;
    }

    const [startRs, startError] = await wrapperAsync(this.handleStart());

    if (startError) {
      console.log(`${this.constructor.name} running failed`);
      return false;
    } else {
      console.log(`${this.constructor.name} running succeed`);
      return true;
    }
  }
}
