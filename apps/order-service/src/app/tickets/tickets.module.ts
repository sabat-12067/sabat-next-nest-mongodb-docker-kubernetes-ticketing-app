import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { Ticket } from './entities/ticket.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Ticket] })],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
