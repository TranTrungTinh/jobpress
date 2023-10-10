import { Controller, Get } from '@nestjs/common';
// import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/global';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    return await this.mailerService.sendMail({
      to: 'trantrungtinh1x96@gmail.com',
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      html: '<b>welcome bla bla</b>', // HTML body content
    });
  }
}
