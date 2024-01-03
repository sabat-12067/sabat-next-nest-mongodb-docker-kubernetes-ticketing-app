/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { env } from './app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = env.PORT || 6000;
  await app.listen(port);

  logger.log(
    `tickets-service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
