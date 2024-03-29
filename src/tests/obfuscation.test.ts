import { expect, test } from "vitest";
import { emailObfuscation } from "../utils/obfuscation";

test("Obfuscation one email", () => {
	const message = "Hello, my email is test@gmail.com";
	const obfuscatedMessage = emailObfuscation(message);
	expect(obfuscatedMessage).toBe("Hello, my email is t****@g****.com");

	const message2 = "Hello, my email is stevensermeus@gmail.com";
	const obfuscatedMessage2 = emailObfuscation(message2);
	expect(obfuscatedMessage2).toBe("Hello, my email is s****@g****.com");
});

test("Obfuscation with multiple emails", () => {
	const message =
		"Hello, my emails are stevensermeus@gmail.com and stevensermeus@yahoo.fr";
	const message3 = message + " and stevensermeus@nobody.com";
	const obfuscatedMessage = emailObfuscation(message);
	const obfuscatedMessage3 = emailObfuscation(message3);
	expect(obfuscatedMessage).toBe(
		"Hello, my emails are s****@g****.com and s****@y****.com"
	);

	expect(obfuscatedMessage3).toBe(
		"Hello, my emails are s****@g****.com and s****@y****.com and s****@n****.com"
	);
});

test("Obfuscation with no email", () => {
	const message = "Hello, my name is Steven";
	const obfuscatedMessage = emailObfuscation(message);
	expect(obfuscatedMessage).toBe(message);
});
