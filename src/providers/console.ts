import { LogType, MoreInfo } from "../types/index";
import { Provider } from "./provider";
import chalk from "chalk";

export class ConsoleProvider extends Provider {
  constructor(
    logLevels: LogType[] = [
      LogType.INFO,
      LogType.WARNING,
      LogType.CRITICAL,
      LogType.ERROR,
    ],
  ) {
    super(logLevels);
  }
  public log(message: string, moreInfo: MoreInfo): void {
    if (!this.getLogLevels().includes(moreInfo.type)) {
      return;
    }
    switch (moreInfo.type) {
      case LogType.INFO:
        console.log(chalk.blue(message));
        break;
      case LogType.WARNING:
        console.log(chalk.yellow(message));
        break;
      case LogType.DEBUG:
        console.log(chalk.green(message));
        break;
      case LogType.CRITICAL:
        console.log(chalk.red(message));
        break;
      case LogType.ERROR:
        console.log(chalk.red(message));
        break;
    }
  }
}
