import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class UpdateTicketServiceDto extends PartialType(CreateTicketDto) {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  version?: number;
}
