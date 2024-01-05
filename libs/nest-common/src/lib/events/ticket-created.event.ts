import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export interface ITicketCreatedEvent {
  id: string;
  version?: number;
  title: string;
  price: number;
  userId: string;
}

export class TicketCreatedEventDto implements ITicketCreatedEvent {
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

  constructor(init: Partial<TicketCreatedEventDto>) {
    Object.assign(this, init);
  }
}

export class TicketCreatedEvent {
  constructor(private readonly props: ITicketCreatedEvent) {}

  toString() {
    console.debug('TicketCreatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
