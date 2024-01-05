import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Topics } from '@ticketing-app/nest-common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@Controller()
export class TicketsController {
  private readonly logger = new Logger(TicketsController.name);
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly orm: MikroORM
  ) {}

  @EventPattern(Topics.TicketCreated)
  @CreateRequestContext()
  async create(
    @Payload() createTicketDto: CreateTicketDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.log(createTicketDto);

    await this.ticketsService.create(createTicketDto);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }

  @EventPattern(Topics.TicketUpdated)
  @CreateRequestContext()
  async update(
    @Payload() updateTicketDto: UpdateTicketDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.log(updateTicketDto);

    await this.ticketsService.update(updateTicketDto.id, updateTicketDto);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
