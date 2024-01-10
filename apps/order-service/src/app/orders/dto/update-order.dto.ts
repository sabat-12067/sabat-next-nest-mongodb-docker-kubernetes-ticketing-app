import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@ticketing-app/nest-common';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  readonly status: OrderStatus;
}
