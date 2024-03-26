import md5 from "md5";
import { Provider, TrustedProvider } from "./providers/provider";
import { LogType, MoreInfo } from "./types";
interface Configuration {
	trustedProvider: TrustedProvider;
	otherProviders: Provider[];
}
export class Logger {
	private format: string = "HASH [TYPE] HH:MI:SS:MS DD/MM/YYYY TZ MSG";
	private allProviders: Provider[];
	private lastMessageHash: string = "";
	private static _instance: Logger;

	private constructor(private configuration: Configuration) {
		const trustedProviderLevels =
			this.configuration.trustedProvider.getLogLevel();
		const allLevels = [
			LogType.CRITICAL,
			LogType.ERROR,
			LogType.WARNING,
			LogType.INFO,
			LogType.DEBUG,
		];
		for (const level of allLevels) {
			if (!trustedProviderLevels.includes(level)) {
				throw new Error(
					"Trusted provider must have all log levels enabled to ensure consistency."
				);
			}
		}
		this.configuration = configuration;
		this.allProviders = [
			this.configuration.trustedProvider,
			...this.configuration.otherProviders,
		];
		this.lastMessageHash = this.hash(
			this.configuration.trustedProvider.getLastMessage()
		);
	}
	public static getLogger(configuration: Configuration | void): Logger {
		if (configuration && !this._instance) {
			this._instance = new Logger(configuration);
			return this._instance;
		}
		if (!configuration && !this._instance) {
			throw new Error("Logger not set up");
		}
		return this._instance;
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
		this.lastMessageHash = this.hash(formattedMessage);
		this.allProviders.forEach((provider) =>
			provider.log(formattedMessage, moreInfo)
		);
	}

	formatMessage(message: string, type: LogType, timeLogged: Date): string {
		return this.format
			.replace("HASH", this.lastMessageHash)
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
	}
	private hash(message: string): string {
		return md5(message);
	}
}
