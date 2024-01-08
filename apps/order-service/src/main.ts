/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { env } from './app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [env.RABBIT_MQ_URI],
        queue: 'order_queue',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
    { inheritAppConfig: true }
  );
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
