import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Topics } from '@ticketing-app/nest-common';
import { CreateRequestContext } from '@mikro-orm/core';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(Topics.OrderCreated)
  @CreateRequestContext()
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @EventPattern(Topics.OrderCancelled)
  @CreateRequestContext()
  update(@Payload() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(updateOrderDto.id, updateOrderDto);
  }
}
