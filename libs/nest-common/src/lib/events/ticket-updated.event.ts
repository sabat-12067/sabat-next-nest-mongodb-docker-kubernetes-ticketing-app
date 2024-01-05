import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export interface ITicketUpdatedEvent {
  id: string;
  version?: number;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

export class TicketUpdatedEventDto implements ITicketUpdatedEvent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsInt()
  version?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  orderId?: string;

  constructor(init: Partial<TicketUpdatedEventDto>) {
    Object.assign(this, init);
  }
}

export class TicketUpdatedEvent {
  constructor(private readonly props: ITicketUpdatedEvent) {}

  toString() {
    console.debug('TicketUpdatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
