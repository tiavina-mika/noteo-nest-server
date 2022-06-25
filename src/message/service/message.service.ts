import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_MESSAGE_LANGUAGE } from 'src/message/message.constant';
import { IMessageOptions, IMessageSetOptions } from '../message.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MessageService {
  private readonly defaultLanguage: string;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService
  ) {
    this.defaultLanguage = this.configService.get<string>('app.language');
  }

  async get(key: string, options?: IMessageOptions): Promise<string> {
    const { properties, appLanguage } = options
      ? options
      : { properties: undefined, appLanguage: undefined };

    if (appLanguage) {
      const message = await this.setMessage(appLanguage, key, {
        properties,
      });

      return message;
    }

    return this.setMessage(this.defaultLanguage, key, {
      properties,
    });
  }

  private setMessage(
    lang: string,
    key: string,
    options?: IMessageSetOptions
  ): any {
    return this.i18n.translate(key, {
      lang: lang,
      args: options && options.properties ? options.properties : undefined,
    });
  }

  async getLanguages(): Promise<string[]> {
    return Object.values(ENUM_MESSAGE_LANGUAGE);
  }
}
