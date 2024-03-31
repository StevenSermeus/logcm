import { LogType, MoreInfo } from "../types/index";
import { Provider } from "./provider";
import * as fs from "fs";
import path from "path";

interface FileProviderOptions {
  folderPath?: string;
  fileByDay?: boolean;
  fileName?: string;
  logLevel?: LogType[];
}

export class FileProvider extends Provider {
  private folderPath: string;
  private fileByDay: boolean;
  private fileName: string;

  constructor(
    {
      folderPath = "./logs",
      fileByDay = false,
      fileName = "log.log",
      logLevel = [
        LogType.INFO,
        LogType.WARNING,
        LogType.CRITICAL,
        LogType.ERROR,
      ],
    }: FileProviderOptions = {
      folderPath: "./logs",
      fileByDay: false,
      fileName: "log.log",
      logLevel: [
        LogType.INFO,
        LogType.WARNING,
        LogType.CRITICAL,
        LogType.ERROR,
      ],
    },
  ) {
    super(logLevel);
    this.folderPath = folderPath;
    this.fileByDay = fileByDay;
    this.fileName = fileName;
  }

  public log(message: string, moreInfo: MoreInfo): void {
    if (!this.getLogLevels().includes(moreInfo.type)) {
      return;
    }
    const today = moreInfo.timeLogged;
    const fileName = this.getFileName(today);
    const filePath = path.join(this.folderPath, fileName);
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath);
    }
    fs.appendFileSync(filePath, `${message}\n`);
  }

  public getFileName(today: Date): string {
    if (this.fileByDay) {
      return `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}-${
        this.fileName
      }`;
    }
    return this.fileName;
  }
}
