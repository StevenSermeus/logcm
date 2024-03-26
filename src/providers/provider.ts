import { LogType, MoreInfo } from "../types/index";

export abstract class Provider {
	public abstract log(message: string, moreInfo: MoreInfo): void;
}

export abstract class TrustedProvider extends Provider {
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
