import { LogType, MoreInfo } from "../types/index";

export abstract class Provider {
  private logLevels: LogType[];
  constructor(logLevels: LogType[]) {
    this.logLevels = logLevels;
  }
  public getLogLevels(): LogType[] {
    return this.logLevels;
  }
  public abstract log(message: string, moreInfo: MoreInfo): void;
}
