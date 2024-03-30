export enum LogType {
  INFO = "INFO",
  WARNING = "WARNING",
  DEBUG = "DEBUG",
  CRITICAL = "CRITICAL",
  ERROR = "ERROR",
}

export enum Token {
  HOURE = "HH",
  MINUTE = "MI",
  SECOND = "SS",
  MILLI_SECOND = "MS",
  TIMEZONE = "TZ",
  DAY = "DD",
  MONTH = "MM",
  YEAR = "YYYY",
  MESSAGE = "MSG",
  TYPE = "TYPE",
  TIMESTAMP = "TS",
}

export interface MoreInfo {
  messageNotFormatted: string;
  messageHmac: string | undefined;
  type: LogType;
  timeLogged: Date;
}
