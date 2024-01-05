import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@ticketing-app/nest-common';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly ticketId: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status: string;
}
