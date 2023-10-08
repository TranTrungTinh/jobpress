import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorator/global';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
