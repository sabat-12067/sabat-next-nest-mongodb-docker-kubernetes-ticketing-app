import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  AuthGuard,
  IOrderCancelledEvent,
  IOrderCreatedEvent,
  LoggedInUser,
  Public,
  Topics,
} from '@ticketing-app/nest-common';
import { UserinfoResponse } from 'openid-client';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly orm: MikroORM
  ) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @LoggedInUser() user: UserinfoResponse
  ) {
    return this.ticketsService.create({ ...createTicketDto }, user.sub);
  }

  @Public()
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    // TODO: check user authorization
    // TODO: Do not allow edit if ticket is reserved
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @Public()
  @EventPattern(Topics.OrderCreated)
  @CreateRequestContext()
  async handleOrderCreated(@Payload() payload: IOrderCreatedEvent) {
    return await this.ticketsService.update(payload.ticket.id, {
      orderId: payload.id,
    });
  }

  @Public()
  @EventPattern(Topics.OrderCancelled)
  @CreateRequestContext()
  async handleOrderCancelled(@Payload() payload: IOrderCancelledEvent) {
    return this.ticketsService.update(payload.ticket.id, {
      orderId: undefined,
    });
  }
}
