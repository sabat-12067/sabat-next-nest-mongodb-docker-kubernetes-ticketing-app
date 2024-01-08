import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export interface IOrderCancelledEvent {
  id: string;
  version?: number;
  ticket: {
    id: string;
  };
}

class TicketDto implements Readonly<TicketDto> {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class OrderCancelledEventDto implements IOrderCancelledEvent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @Min(0)
  version?: number;

  @IsObject()
  @IsNotEmpty()
  @Type(() => TicketDto)
  ticket: TicketDto;
}

export class OrderCancelledEvent {
  constructor(private readonly props: IOrderCancelledEvent) {}

  toString() {
    console.debug('OrderCancelledEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
