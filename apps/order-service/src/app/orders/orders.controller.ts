import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  AuthGuard,
  LoggedInUser,
  OrderStatus,
  PaymentCreatedEventDto,
  Topics,
} from '@ticketing-app/nest-common';
import { UserinfoResponse } from 'openid-client';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orm: MikroORM
  ) {}

  @Post()
  async create(
    @LoggedInUser() user: UserinfoResponse,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return await this.ordersService.create(createOrderDto, user.sub);
  }

  @Get()
  findAll(@LoggedInUser() user: UserinfoResponse) {
    return this.ordersService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @EventPattern(Topics.PaymentComplete)
  @CreateRequestContext()
  async handlePaymentCreated(
    @Payload() { orderId }: PaymentCreatedEventDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.log({ orderId }, `Received event: ${Topics.PaymentComplete}`);

    await this.ordersService.update(orderId, { status: OrderStatus.COMPLETE });

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
