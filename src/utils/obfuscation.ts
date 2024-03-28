export function emailObfuscation(message: string): string {
	const emailRegex = /[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/g;
	return message.replace(emailRegex, (email) => {
		const [first, domain] = email.split("@");
		return `${first[0]}****@${domain[0]}****.com`;
	});
}
