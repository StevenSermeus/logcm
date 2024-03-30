import { z } from "zod";
import { LogType, MoreInfo } from "../types/index";
import { Provider } from "./provider";
import chalk from "chalk";

const configurationSchema = z.object({
  logLevel: z
    .array(z.nativeEnum(LogType))
    .default([
      LogType.CRITICAL,
      LogType.ERROR,
      LogType.WARNING,
      LogType.INFO,
      LogType.DEBUG,
    ]),
});

type ConfigurationT = z.infer<typeof configurationSchema>;
export class ConsoleProvider extends Provider {
  private configuration: ConfigurationT;

  constructor(configuration: z.input<typeof configurationSchema>) {
    const parsedConfig = configurationSchema.safeParse(configuration);
    if (!parsedConfig.success) {
      throw new Error("Invalid configuration");
    }
    super(parsedConfig.data.logLevel);
    this.configuration = parsedConfig.data;
  }

  public log(message: string, moreInfo: MoreInfo): void {
    if (!this.configuration.logLevel.includes(moreInfo.type)) return;
    const type = moreInfo.type;
    if (type == LogType.CRITICAL || type == LogType.ERROR) {
      console.error(chalk.redBright(message));
      return;
    }
    if (type == LogType.DEBUG) {
      console.debug(chalk.yellow(message));
      return;
    }
    if (type == LogType.WARNING) {
      console.warn(chalk.bgYellow(message));
      return;
    }
    console.log(chalk.blue(message));
  }
}
