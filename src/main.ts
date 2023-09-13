import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_ENV } from './configs/app.environment';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './core/transfrom.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // TODO: enable global jwt auth guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // TODO: enable global transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // TODO: enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // TODO: enable cookie parser
  app.use(cookieParser());

  // TODO: enable cors
  app.enableCors();

  // TODO: enable swagger

  // TODO: enable compression

  // TODO: enable helmet

  // TODO: enable rate limit

  // TODO: enable logging

  // TODO: enable versioning
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  // ! start app
  await app.listen(configService.get<string>(APP_ENV.APP_PORT));
}
bootstrap();
