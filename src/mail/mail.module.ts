import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SENDER_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDER_AUTH_ROOT'),
            pass: configService.get<string>('SENDER_AUTH_PASS'),
          },
        },
        // template: {
        // dir: join(__dirname, 'templates'),
        // adapter: new HandlebarsAdapter(),
        // options: {
        // strict: true,
        // },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
