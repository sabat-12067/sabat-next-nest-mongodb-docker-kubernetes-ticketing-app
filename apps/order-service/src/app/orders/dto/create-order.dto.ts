import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly ticketId: string;

  @IsNotEmpty()
  readonly status: string;
}
