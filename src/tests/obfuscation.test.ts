import { expect, test } from "vitest";
import { emailObfuscation } from "../utils/obfuscation";

test("Obfuscation test", () => {
	const message = "Hello, my email is test@gmail.com";
	const obfuscatedMessage = emailObfuscation(message);
	expect(obfuscatedMessage).toBe("Hello, my email is t****@g****.com");

	const message2 = "Hello, my email is stevensermeus@gmail.com";
	const obfuscatedMessage2 = emailObfuscation(message2);
	expect(obfuscatedMessage2).toBe("Hello, my email is s****@g****.com");
});
