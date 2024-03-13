import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TransporterService } from './transporter.service';
import {
  AsyncModuleOptions,
  EMAIL_CONNECTION_TOKEN,
  EMAIL_MODULE_OPTIONS,
  ModuleOptions,
} from './transporter.types';

@Module({ imports: [], providers: [], exports: [] })
export class TransporterModule {
  static forRootAsync(options: AsyncModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: EMAIL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: EMAIL_CONNECTION_TOKEN,
        useFactory: async (options: ModuleOptions) => {
          const { host, port, user, pass } = options;
          const client: Transporter<SMTPTransport.SentMessageInfo> =
            createTransport({
              host,
              port,
              secure: port === 465,
              auth: {
                user,
                pass,
              },
            });
          return client;
        },
        inject: [EMAIL_MODULE_OPTIONS],
      },
      TransporterService,
    ];
    return {
      global: true,
      module: TransporterModule,
      providers,
      exports: providers,
      imports: options.imports,
    };
  }
}
