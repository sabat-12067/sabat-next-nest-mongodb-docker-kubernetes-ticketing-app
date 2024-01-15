import { OrderStatus } from '@ticketing-app/nest-common';
import { IsDefined, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsDefined()
  status: OrderStatus;
}
