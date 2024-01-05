import {
  IsDefined,
  IsInstance,
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

  constructor(init: Partial<TicketDto>) {
    Object.assign(this, init);
  }
}

export class OrderCancelledEventDto implements IOrderCancelledEvent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @Min(0)
  version?: number;

  @IsDefined()
  @IsObject()
  @IsInstance(TicketDto)
  ticket: TicketDto;

  constructor(init: Partial<OrderCancelledEventDto>) {
    Object.assign(this, init);
  }
}

export class OrderCancelledEvent {
  constructor(private readonly props: IOrderCancelledEvent) {}

  toString() {
    console.debug('OrderCancelledEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
