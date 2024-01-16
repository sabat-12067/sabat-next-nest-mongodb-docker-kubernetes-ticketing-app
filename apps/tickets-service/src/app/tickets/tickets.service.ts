import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketServiceDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketRepository } from './ticket.repository';
import { EntityManager, wrap } from '@mikro-orm/core';
import { ClientRMQ } from '@nestjs/microservices';
import {
  Topics,
  ITicketCreatedEvent,
  ITicketUpdatedEvent,
  constants,
} from '@ticketing-app/nest-common';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly em: EntityManager,
    @Inject(constants.ORDER_SERVICE)
    private readonly orderClient: ClientRMQ
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    const { title, price } = createTicketDto;
    const ticket = new Ticket({ title, price, userId });

    await this.em.persistAndFlush(ticket);

    this.orderClient.emit<void, ITicketCreatedEvent>(Topics.TicketCreated, {
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: 1,
    });
    this.logger.log(ticket);
    return ticket;
  }

  async findAll() {
    return await this.ticketRepository.find({
      orderId: undefined,
    });
  }

  async findOne(id: string) {
    return await this.ticketRepository.findOne({ id });
  }

  async update(id: string, updateTicketDto: UpdateTicketServiceDto) {
    const ticket = await this.ticketRepository.findOne({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    wrap(ticket).assign(updateTicketDto);
    await this.em.flush();

    this.orderClient.emit<void, ITicketUpdatedEvent>(Topics.TicketUpdated, {
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      // version: ticket.version,
    });
    this.logger.log(ticket, 'Updated ticket');
    return ticket;
  }

  remove(id: string) {
    return this.ticketRepository.nativeDelete({ id });
  }
}
