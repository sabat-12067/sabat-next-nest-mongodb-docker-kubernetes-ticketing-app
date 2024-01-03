import { ITicketCreatedEvent } from '@ticketing-app/nest-common';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketDto implements ITicketCreatedEvent {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  userId: string;

  @IsOptional()
  @IsNumber()
  version: number;
}
