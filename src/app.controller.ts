import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorator/global';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ? This mean is a public route
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
