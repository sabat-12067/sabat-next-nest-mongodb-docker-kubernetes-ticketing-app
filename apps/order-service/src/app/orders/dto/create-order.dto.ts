import { IsNotEmpty, IsEnum } from 'class-validator';
import { OrderStatus } from '@ticketing-app/nest-common';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly ticketId: string;

  @IsEnum(OrderStatus)
  readonly status: string;
}
