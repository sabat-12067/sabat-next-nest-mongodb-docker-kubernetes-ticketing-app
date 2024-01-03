import { IsEnum } from 'class-validator';
import { OrderStatus } from '@ticketing-app/nest-common';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  readonly status: OrderStatus;
}
