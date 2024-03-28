import { expect, test } from "vitest";
import { Logger } from "..";
import { FileProvider } from "../providers";
import { LogType } from "../types";

test("Not configured logger throw error", () => {
	expect(() => {
		Logger.getLogger();
	}).toThrowError();
});

test("Logger with trusted provider not logging all log type", () => {
	expect(() => {
		Logger.getLogger(
			[],
			new FileProvider({
				logLevel: [LogType.CRITICAL],
				fileName: "test.log",
			})
		);
	}).toThrowError();
});
