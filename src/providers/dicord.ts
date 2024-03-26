import { z } from "zod";
import { LogType, MoreInfo } from "../types";
import { Provider } from "./provider";

const configurationSchema = z.object({
	webhook: z.string(),
	webhookTitle: z.string().default("Logging"),
	logLevel: z
		.array(z.nativeEnum(LogType))
		.default([LogType.CRITICAL, LogType.ERROR, LogType.WARNING]),
});

type Configuration = z.infer<typeof configurationSchema>;

export class DiscordProvider extends Provider {
	private configuration: Configuration;
	constructor(configuration: z.input<typeof configurationSchema>) {
		super();
		const parsedConfig = configurationSchema.safeParse(configuration);
		if (!parsedConfig.success) {
			throw new Error(parsedConfig.error.errors[0].message);
		}
		this.configuration = parsedConfig.data;
	}
	public log(message: string, moreInfo: MoreInfo): void {
		if (!this.configuration.logLevel.includes(moreInfo.type)) return;
		try {
			//TODO: Better message style
			const webhookmessage = {
				embeds: [
					{
						title: "Logging",
						fields: [{ name: "message", value: message }],
					},
				],
			};
			fetch(this.configuration.webhook, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(webhookmessage),
			});
		} catch (e) {
			console.error(e);
		}
	}
}
