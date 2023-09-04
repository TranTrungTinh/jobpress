import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_ENV } from './configs/app.environment';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // TODO: enable global jwt auth guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // TODO: enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // TODO: enable cors
  app.enableCors();

  // TODO: enable swagger

  // TODO: enable compression

  // TODO: enable helmet

  // TODO: enable rate limit

  // TODO: enable logging

  // ! start app
  await app.listen(configService.get(APP_ENV.APP_PORT));
}
bootstrap();
