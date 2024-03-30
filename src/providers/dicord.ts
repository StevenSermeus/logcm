import { LogType, MoreInfo } from "../types";
import { Provider } from "./provider";
import { Webhook, MessageBuilder } from "discord-webhook-node";

interface DiscordProviderOptions {
  webhookUrl: string;
  avatarUrl?: string;
  username?: string;
  logLevels: LogType[];
}
/**
 * Be conscious of the rate limits of the Discord API when using this provider and the message may not arrive in the order it was sent. It's recommended to use this provider only to be notified of critical errors.
 */
export class DiscordProvider extends Provider {
  private webhook: Webhook;

  constructor({
    webhookUrl,
    logLevels = [LogType.CRITICAL, LogType.ERROR, LogType.WARNING],
    username = "Logger",
    avatarUrl = "https://avatars.githubusercontent.com/u/67290591?v=4",
  }: DiscordProviderOptions) {
    super(logLevels);
    const urlRegex = new RegExp(
      /https:\/\/discord.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+/,
    );
    if (!urlRegex.test(webhookUrl)) {
      throw new Error("Invalid webhook URL");
    }
    this.webhook = new Webhook({
      url: webhookUrl,
      throwErrors: true,
      retryOnLimit: true,
    });
    this.webhook.setUsername(username);
    this.webhook.setAvatar(avatarUrl);
  }

  public log(message: string, moreInfo: MoreInfo): void {
    if (!this.getLogLevels().includes(moreInfo.type)) {
      return;
    }
    const color = this.getColor(moreInfo.type);
    message = message.replace(moreInfo.messageHmac || "", "");
    const embed = new MessageBuilder()
      .setTitle(moreInfo.type)
      .setDescription(message)
      .setColor(color)
      .addField("Time", moreInfo.timeLogged.toString())
      .addField("Message HMAC", moreInfo.messageHmac || "No HMAC provided")
      .setTimestamp();
    try {
      this.webhook.send(embed);
    } catch (e) {
      console.error(e);
    }
  }

  private getColor(type: LogType): number {
    switch (type) {
      case LogType.INFO:
        return 0x0000ff;
      case LogType.WARNING:
        return 0xffff00;
      case LogType.DEBUG:
        return 0x00ff00;
      case LogType.CRITICAL:
        return 0xff0000;
      case LogType.ERROR:
        return 0xff0000;
      default:
        return 0xffffff;
    }
  }
}
