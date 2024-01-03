import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  AuthGuard,
  LoggedInUser,
  OrderCancelledEvent,
} from '@ticketing-app/nest-common';
import { UserinfoResponse } from 'openid-client';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController implements OnModuleInit {
  constructor(private readonly ordersService: OrdersService) {}

  onModuleInit() {
    // this.ticketClient.subscribeToResponseOf()
  }

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
}
