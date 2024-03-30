import { LogType, MoreInfo } from "../types/index";
import { TrustedProvider } from "./provider";
import { z } from "zod";
import * as fs from "fs";
import path from "path";

const configurationSchema = z.object({
	basePath: z.string().default("./logs"),
	fileName: z.string().default("log.log"),
	fileByDate: z.boolean().default(false),
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

export class FileProvider extends TrustedProvider {
	private configuration: ConfigurationT;

	constructor(
		configuration: z.input<typeof configurationSchema> = {
			basePath: "./logs",
			fileName: "log.log",
			fileByDate: false,
			logLevel: [
				LogType.CRITICAL,
				LogType.ERROR,
				LogType.WARNING,
				LogType.INFO,
				LogType.DEBUG,
			],
		}
	) {
		const parsedConfig = configurationSchema.safeParse(configuration);
		if (!parsedConfig.success) {
			throw new Error("Invalid configuration");
		}
		super(parsedConfig.data.logLevel);
		this.configuration = parsedConfig.data;
		if (!fs.existsSync(this.configuration.basePath)) {
			fs.mkdirSync(this.configuration.basePath);
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	log(message: string, moreInfo: MoreInfo): void {
		fs.writeFileSync(
			path.join(this.configuration.basePath, this.getFilename()),
			message + "\n",
			{
				flag: "a",
			}
		);
	}

	getLastMessage(): string {
		if (
			!fs.existsSync(path.join(this.configuration.basePath, this.getFilename()))
		) {
			return this.initialLog();
		}
		if (this.configuration.fileByDate) {
			//read directory and get the last file
			const files = fs.readdirSync(this.configuration.basePath);
			const orderFiles = files.sort();
			const lastFile = orderFiles[orderFiles.length - 1];
			const data = fs.readFileSync(
				path.join(this.configuration.basePath, lastFile),
				"utf8"
			);
			const lines = data.trim().split("\n");
			return lines[lines.length - 1];
		}
		const data = fs.readFileSync(
			path.join(this.configuration.basePath, this.configuration.fileName),
			"utf8"
		);
		return data[data.length - 1];
	}

	getFilename(): string {
		if (this.configuration.fileByDate) {
			const today = new Date();
			return `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}-${
				this.configuration.fileName
			}`;
		}
		return this.configuration.fileName;
	}
}
