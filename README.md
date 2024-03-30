# logcm

A modular logger for javascript/typescript projects. This logger can be used to log messages to the console, file, database, etc. You can easily add new providers by extending the `Provider` class or `TrustedProvider` class. The logger is a singleton and can be used in multiple files without having to pass it around. A sha256 hash of the last message is added to the message to confirm that the message hasn't been tampered with.

## Usage/Examples

The logger can be used in the following way:

### A logger with a trusted provider

Message will contain a sha256 hash of the last message to confirm that the message hasn't been tampered with.

```ts
import { Logger } from "logcm";
import {
  ConsoleProvider,
  FileProvider,
  DiscordProvider,
} from "logcm/providers";

const logger = Logger.getLogger(
  [
    new ConsoleProvider({}),
    new DiscordProvider({
      webhook: "http://....",
    }),
  ],
  new FileProvider({
    basePath: "./logs",
    fileByDate: true,
    fileName: "log.txt",
  }),
);

logger.info("Hello world");
logger.warn("Hello world");
```

### A logger without a trusted provider

Message will not contain a sha256 it will act as a normal logger.

```ts
import { Logger } from "logcm";
import {
  ConsoleProvider,
  FileProvider,
  DiscordProvider,
} from "logcm/providers";

const logger = Logger.getLogger([
  new ConsoleProvider({}),
  new DiscordProvider({
    webhook: "http://....",
  }),
  new FileProvider({
    basePath: "./logs",
    fileByDate: true,
    fileName: "log.txt",
  }),
]);

logger.info("Hello world");
logger.warn("Hello world");
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

## Roadmap

- Add more providers.

- Add log integrity check.

- Add custom log format option.

- Evaluate the possibility to change the hashing technique use to hash the last message.(Maybe add a secret key at the end of the message before hashing it)

- Using custom error.
