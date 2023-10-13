/* eslint-disable prettier/prettier */
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_ENV } from './configs/app.environment';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './core/transfrom.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // TODO: enable compression
  app.use(compression());

  // TODO: enable helmet
  app.use(helmet());

  // TODO: enable logging

  // TODO: enable versioning
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // TODO: enable swagger
  const config = new DocumentBuilder()
    .setTitle('JobPress APIs')
    .setDescription('The JobPress API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token'
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});

  // ! start app
  await app.listen(configService.get<string>(APP_ENV.APP_PORT));
}
bootstrap();
