import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SubscriberSchema } from 'src/subscribers/schema/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schema/job.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobSchema },
    ]),
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
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
})
export class MailModule {}
