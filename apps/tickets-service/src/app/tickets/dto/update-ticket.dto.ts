import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsOptional } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class UpdateTicketServiceDto extends PartialType(CreateTicketDto) {
  @IsOptional()
  orderId?: string;

  @IsOptional()
  version?: number;
}
