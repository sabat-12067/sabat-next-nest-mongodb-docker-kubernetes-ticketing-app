import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { LoggedInUser } from '@ticketing-app/nest-common';
import { UserinfoResponse } from 'openid-client';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @LoggedInUser() user: UserinfoResponse,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(createOrderDto, user.sub);
  }

  @Get()
  findAll(@LoggedInUser() user: UserinfoResponse) {
    return this.ordersService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
