/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'order',
        brokers: ['localhost:9094'],
      },
      consumer: {
        groupId: 'order-consumer',
      },
    },
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();
  const port = process.env.PORT || 6001;

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(
    `order-service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
