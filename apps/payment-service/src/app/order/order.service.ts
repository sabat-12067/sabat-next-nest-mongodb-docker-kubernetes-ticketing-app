import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { EntityManager, wrap } from '@mikro-orm/core';
import { Order } from './entities/order.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly em: EntityManager
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { price, status, userId, id } = createOrderDto;
    const order = new Order({
      id,
      price,
      status,
      userId,
    });

    await this.em.persistAndFlush(order);
    this.logger.log(order, 'New order is created');
    return order;
  }

  findAll() {
    return this.orderRepository.findAll({});
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ id });
    if (!order) {
      throw new RpcException(`Order ${id} is not found`);
    }
    wrap(order).assign(updateOrderDto);

    await this.em.persistAndFlush(order);
    this.logger.log(order, 'order is updated');
    return order;
  }

  remove(id: string) {
    return this.orderRepository.nativeDelete({ id });
  }
}
