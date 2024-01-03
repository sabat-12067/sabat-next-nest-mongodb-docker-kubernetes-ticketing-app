import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketServiceDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketRepository } from './ticket.repository';
import { EntityManager, wrap } from '@mikro-orm/core';
import { ClientKafka } from '@nestjs/microservices';
import {
  Topics,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@ticketing-app/nest-common';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly em: EntityManager,
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientKafka
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    const { title, price } = createTicketDto;
    const ticket = new Ticket({ title, price, userId });

    await this.em.persistAndFlush(ticket);

    this.orderClient.emit(
      Topics.TicketCreated,
      new TicketCreatedEvent({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: 1,
      })
    );
    return ticket;
  }

  async findAll() {
    return await this.ticketRepository.find({});
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

    this.orderClient.emit(
      Topics.TicketUpdated,
      new TicketUpdatedEvent({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        // version: ticket.version,
      })
    );
    return ticket;
  }

  remove(id: string) {
    return this.ticketRepository.nativeDelete({ id });
  }
}
