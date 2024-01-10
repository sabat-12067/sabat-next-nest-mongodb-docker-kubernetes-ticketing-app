import { PartialType } from '@nestjs/mapped-types';
import { TicketCreatedEventDto } from '@ticketing-app/nest-common';

export class UpdateTicketDto extends PartialType(TicketCreatedEventDto) {}
