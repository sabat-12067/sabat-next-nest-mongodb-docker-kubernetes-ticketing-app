import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Ticket } from './entities/ticket.entity';
import { JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Ticket] }),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order',
            brokers: ['localhost:9094'],
          },
          consumer: {
            groupId: 'order-consumer',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, JwtService],
})
export class TicketsModule {}
