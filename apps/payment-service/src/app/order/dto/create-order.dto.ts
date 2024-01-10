import { OrderStatus } from '@ticketing-app/nest-common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  status: OrderStatus;
}
