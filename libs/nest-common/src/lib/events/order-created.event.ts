import { OrderStatus } from './index';
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

class TicketDto implements Readonly<TicketDto> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @Min(0)
  price: number;

  constructor(init: Partial<TicketDto>) {
    Object.assign(this, init);
  }
}

export class OrderCreatedEventDto implements IOrderCreatedEvent {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsInt()
  version?: number;

  @IsDefined()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDefined()
  @IsDateString()
  expiresAt: string;

  @IsDefined()
  @IsObject()
  @IsInstance(TicketDto)
  ticket: TicketDto;

  constructor(init: Partial<OrderCreatedEventDto>) {
    Object.assign(this, init);
  }
}

export class OrderCreatedEvent {
  constructor(private readonly props: IOrderCreatedEvent) {}

  toString() {
    console.debug('OrderCreatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
