import { createHmac } from "crypto";
import { Provider } from "./providers/provider";
import { LogType, MoreInfo } from "./types";
export { LogType, MoreInfo, Provider };

export class Logger {
  private allProviders: Provider[];
  private static _instance: Logger;
  private secret: string | undefined;
  private format: string;

  private constructor(
    format: string | undefined,
    providers: Provider[],
    secret: string | undefined,
  ) {
    this.format = format || "[TYPE] HH:MI:SS:MS DD/MM/YYYY TZ MSG";
    this.allProviders = providers;
    this.secret = secret;
  }

  public info(message: string): void {
    this.log(message, LogType.INFO);
  }

  public warn(message: string): void {
    this.log(message, LogType.WARNING);
  }

  public debug(message: string): void {
    this.log(message, LogType.DEBUG);
  }

  public critical(message: string): void {
    this.log(message, LogType.CRITICAL);
  }

  public error(message: string): void {
    this.log(message, LogType.ERROR);
  }

  private log(message: string, type: LogType): void {
    const timeLogged = new Date();
    let messageFormatted = this.formatMessage(message, type, timeLogged);
    const moreInfo: MoreInfo = {
      messageNotFormatted: message,
      type,
      timeLogged,
      messageHmac: undefined,
    };
    if (this.secret) {
      moreInfo.messageHmac = this.hmacHash(messageFormatted);
      messageFormatted += ` ${moreInfo.messageHmac}`;
    }
    this.allProviders.forEach((provider) =>
      provider.log(messageFormatted, moreInfo),
    );
  }

  public static getLogger(
    format: string | undefined,
    providers: Provider[],
    secret: string,
  ): Logger;

  public static getLogger(providers: Provider[], secret: string): Logger;

  public static getLogger(provider: Provider, secret: string): Logger;

  public static getLogger(
    format: string | undefined,
    providers: Provider[],
  ): Logger;

  public static getLogger(providers: Provider[]): Logger;

  public static getLogger(format: string, provider: Provider): Logger;

  public static getLogger(provider: Provider): Logger;

  public static getLogger(): Logger;

  public static getLogger(
    args1?: string | Provider | Provider[],
    args2?: Provider | Provider[] | string,
    secret?: string,
  ): Logger {
    if (Logger._instance) {
      return Logger._instance;
    }
    let format: string | undefined;
    let providers: Provider[] = [];

    if (typeof args1 === "string") {
      format = args1;
    } else if (args1 instanceof Provider) {
      providers.push(args1);
    }
    if (Array.isArray(args1)) {
      providers = args1;
    }
    if (args2 instanceof Provider) {
      providers.push(args2);
    } else if (Array.isArray(args2)) {
      providers = args2;
    } else if (typeof args2 === "string") {
      secret = args2;
    }
    Logger._instance = new Logger(format, providers, secret);
    return Logger._instance;
  }

  formatMessage(message: string, type: LogType, timeLogged: Date): string {
    return this.format
      .replace("TYPE", type)
      .replace("HH", timeLogged.getHours().toString())
      .replace("MI", timeLogged.getMinutes().toString())
      .replace("SS", timeLogged.getSeconds().toString())
      .replace("MS", timeLogged.getMilliseconds().toString())
      .replace("TZ", timeLogged.getTimezoneOffset().toString())
      .replace("DD", timeLogged.getDate().toString())
      .replace("MM", (timeLogged.getMonth() + 1).toString())
      .replace("YYYY", timeLogged.getFullYear().toString())
      .replace("MSG", message);
  }

  private hmacHash(message: string): string {
    if (!this.secret) {
      throw new Error("Secret is not defined");
    }
    return createHmac("sha256", this.secret).update(message).digest("hex");
  }
}
