import { ITicketCreatedEvent } from '@ticketing-app/nest-common';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTicketDto implements ITicketCreatedEvent {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsOptional()
  userId: string;

  @IsOptional()
  @IsNumber()
  version: number;
}
