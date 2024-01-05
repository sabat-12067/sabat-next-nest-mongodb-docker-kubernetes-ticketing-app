import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketRepository } from './ticket.repository';

import { EntityManager, wrap } from '@mikro-orm/core';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly em: EntityManager
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = new Ticket(createTicketDto);

    await this.em.persistAndFlush(ticket);
    this.logger.log(ticket);
    return ticket;
  }

  findAll() {
    return this.ticketRepository.findAll({});
  }

  findOne(id: string) {
    return this.ticketRepository.findOne({ id });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOneOrFail({ id });
    wrap(ticket).assign(updateTicketDto);
    await this.em.flush();

    return ticket;
  }

  remove(id: string) {
    return this.ticketRepository.nativeDelete({ id });
  }
}
