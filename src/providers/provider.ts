import { LogType, MoreInfo } from "../types/index";

export abstract class Provider {
	private logLevel: LogType[];
	constructor(logLevel: LogType[]) {
		this.logLevel = logLevel;
	}
	public getLogLevel(): LogType[] {
		return this.logLevel;
	}
	public abstract log(message: string, moreInfo: MoreInfo): void;
}

export abstract class TrustedProvider extends Provider {
	constructor(
		logLevel: LogType[] = [
			LogType.CRITICAL,
			LogType.ERROR,
			LogType.WARNING,
			LogType.INFO,
			LogType.DEBUG,
		]
	) {
		super(logLevel);
	}
	public abstract getLastMessage(): string;
	public initialLog(): string {
		const seed =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		const formattedSeedMessage = `Initial seed: ${seed}`;
		this.log(formattedSeedMessage, {
			type: LogType.INFO,
			messageNotFormatted: formattedSeedMessage,
			timeLogged: new Date(),
			lastMessageHash: "First message",
		});
		return formattedSeedMessage;
	}
}
