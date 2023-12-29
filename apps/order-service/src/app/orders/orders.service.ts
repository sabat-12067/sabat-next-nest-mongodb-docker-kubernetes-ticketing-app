import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { TicketRepository } from './ticket.repository';
import { Order, OrderStatus } from './entities/order.entity';
import { validate } from 'class-validator';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly em: EntityManager
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { ticketId } = createOrderDto;
    // Find the ticket the user is trying to order in the database
    const ticket = await this.ticketRepository.findOne({
      id: ticketId,
    });
    console.log(ticket);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await this.ticketRepository.isReserved(ticket);
    console.log(isReserved);
    if (isReserved) {
      throw new BadRequestException('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database

    const order = new Order(
      '658c1b6a96ade0c06d0c2bdd',
      OrderStatus.CREATED,
      ticket
    );
    const errors = await validate(order);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Input data validation failed',
        errors: { username: 'Userinput is not valid.' },
      });
    } else {
      await this.em.persistAndFlush(order);
      return order;
    }
  }

  async findAll(userId: string) {
    const orders = await this.orderRepository.find(
      {
        userId,
      },
      { populate: ['ticket'] }
    );

    return orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
