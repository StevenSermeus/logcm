import { Provider, TrustedProvider } from "./providers/provider";
import { createHash } from "crypto";
import { LogType, MoreInfo } from "./types";

export class Logger {
	private format: string = "HASH[TYPE] HH:MI:SS:MS DD/MM/YYYY TZ MSG";
	private allProviders: Provider[];
	private trustedProvider: TrustedProvider | null = null;
	private lastMessageHash: string = "";
	private static _instance: Logger;
	private trustedProviderLogLevelRequired: LogType[] = [
		LogType.CRITICAL,
		LogType.ERROR,
		LogType.WARNING,
		LogType.INFO,
		LogType.DEBUG,
	];

	private constructor(
		providers: Provider[],
		trustedProvider: TrustedProvider | null = null
	) {
		this.allProviders = providers;
		if (trustedProvider) {
			const providerLogLevel = trustedProvider.getLogLevel();
			for (const logLevel of this.trustedProviderLogLevelRequired) {
				if (!providerLogLevel.includes(logLevel)) {
					throw new Error(
						`Trusted provider must have log level ${logLevel} but has ${providerLogLevel.join(
							", "
						)}`
					);
				}
			}
			this.trustedProvider = trustedProvider;
			this.allProviders.unshift(trustedProvider);
			this.lastMessageHash = this.hash(trustedProvider.getLastMessage());
		}
	}
	public static getLogger(): Logger;
	public static getLogger(providers: Provider[]): Logger;
	public static getLogger(
		providers: Provider[],
		trustedProvider: TrustedProvider
	): Logger;
	public static getLogger(trustedProvider: TrustedProvider): Logger;

	public static getLogger(
		providers?: Provider[] | TrustedProvider,
		trustedProvider?: TrustedProvider
	): Logger {
		if (!Logger._instance) {
			if (providers instanceof Array) {
				Logger._instance = new Logger(providers, trustedProvider || null);
			} else if (providers instanceof TrustedProvider) {
				Logger._instance = new Logger([], providers);
			} else {
				throw new Error("Logger not configured");
			}
		}
		return Logger._instance;
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
		const formattedMessage = this.formatMessage(message, type, timeLogged);
		const moreInfo: MoreInfo = {
			type,
			messageNotFormatted: message,
			timeLogged,
			lastMessageHash: this.lastMessageHash,
		};
		if (this.trustedProvider !== null) {
			this.lastMessageHash = this.hash(formattedMessage);
		}
		this.allProviders.forEach((provider) =>
			provider.log(formattedMessage, moreInfo)
		);
	}

	formatMessage(message: string, type: LogType, timeLogged: Date): string {
		const formattedMessage = this.format
			.replace("TYPE", type)
			.replace("HH", timeLogged.getHours().toString())
			.replace("MI", timeLogged.getMinutes().toString())
			.replace("SS", timeLogged.getSeconds().toString())
			.replace("TS", timeLogged.getTime().toString())
			.replace("MS", timeLogged.getMilliseconds().toString())
			.replace("TZ", timeLogged.getTimezoneOffset().toString())
			.replace("DD", timeLogged.getDate().toString())
			.replace("MM", timeLogged.getMonth().toString())
			.replace("YYYY", timeLogged.getFullYear().toString())
			.replace("MSG", message);
		if (this.trustedProvider === null) {
			return formattedMessage.replace("HASH", "");
		}
		return formattedMessage.replace("HASH", this.lastMessageHash + " ");
	}
	private hash(message: string): string {
		return createHash("sha256").update(message).digest("hex");
	}
}
