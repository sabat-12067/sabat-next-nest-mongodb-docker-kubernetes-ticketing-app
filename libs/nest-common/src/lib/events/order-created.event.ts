import { OrderStatus } from './index';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export interface IOrderCreatedEvent {
  id: string;
  version?: number;
  status: OrderStatus;
  userId: string;
  expiresAt: string;
  ticket: {
    id: string;
    price: number;
  };
}

class TicketDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @Min(0)
  price: number;
}

export class OrderCreatedEventDto implements IOrderCreatedEvent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsInt()
  version?: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  expiresAt: string;

  @IsObject()
  @IsNotEmpty()
  @Type(() => TicketDto)
  ticket: TicketDto;
}

export class OrderCreatedEvent {
  constructor(private readonly props: IOrderCreatedEvent) {}

  toString() {
    console.debug('OrderCreatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
