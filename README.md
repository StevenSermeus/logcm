# logcm

A modular logger for javascript/typescript projects. This logger can be used to log messages to the console, file, database, etc. You can easily add new providers by extending the `Provider` class or `TrustedProvider` class. The logger is a singleton and can be used in multiple files without having to pass it around. A md5 hash of the last message is added to the message to confirm that the message hasn't been tampered with.

## Usage/Examples

The logger can be used in the following way:

```ts
import { Logger } from "logcm";
import { FileProvider, ConsoleProvider } from "logcm/providers";

const logger = Logger.getLogger({
	trustedProvider: new FileProvider({}),
	otherProviders: [
		new ConsoleProvider(),
		new DiscordProvider({
			webhook: "webhook url",
		}),
	],
});

logger.info("This is a info message");
logger.warn("This is a warning message");
logger.error("This is a error message");
logger.debug("This is a debug message");
logger.critical("This is a critical message");

const logger2 = Logger.getLogger();

logger2.info("This is a info message");
```

### Create a new TrustedProvider

The `TrustedProvider` class can be extended to create a new provider. It's to be noted that the method `getLastMessage` should be implemented to get the last message from the provider. In cas it's the first log call the method `initialLog` that will log and return the first message. **In addition a `TrustedProvider` should log message of all log levels to insure integrity of the log messages.**

## Installation

Install my-project with npm, pnpm or yarn

```bash
  npm install logcm
  yarn add logcm
  pnpm add logcm
```

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Authors

- [@StevenSermeus](https://github.com/StevenSermeus)
