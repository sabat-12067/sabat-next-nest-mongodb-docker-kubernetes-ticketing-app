import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public, Topics } from '@ticketing-app/nest-common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@Public()
@Controller()
export class TicketsController {
  private readonly logger = new Logger(TicketsController.name);
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly orm: MikroORM
  ) {}

  @EventPattern(Topics.TicketCreated)
  @CreateRequestContext()
  create(@Payload() createTicketDto: CreateTicketDto) {
    this.logger.log(createTicketDto);

    return this.ticketsService.create(createTicketDto);
  }

  @EventPattern(Topics.TicketUpdated)
  @CreateRequestContext()
  update(@Payload() updateTicketDto: UpdateTicketDto) {
    this.logger.log(updateTicketDto);

    return this.ticketsService.update(updateTicketDto.id, updateTicketDto);
  }
}
