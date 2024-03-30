# logcm

A modular logger for javascript/typescript projects. This logger can be used to log messages to the console, file, database, etc. You can easily add new providers by extending the `Provider` class. The logger can be configured to log messages in a specific format. The log integrity can be ensured by using a secret key to add a hmac signature to the log messages.

## Usage/Examples

The logger can be used in the following way:

```ts
import { Logger } from "logcm";
import {
  ConsoleProvider,
  FileProvider,
  DiscordProvider,
} from "logcm/providers";

const logger = Logger.getLogger(
  "[TYPE] HH:MI:SS:MS DD/MM/YYYY TZ MSG",
  [
    new DiscordProvider({
      webhookUrl: "discord webhook url",
    }),
    new FileProvider(),
    new ConsoleProvider(),
  ],
  process.env.SECRET,
);

logger.info("This is an info message");

logger.warn("This is a warning message");

logger.debug("This is a debug message");

logger.critical("This is a critical message");

logger.error("This is an error message");
```

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
