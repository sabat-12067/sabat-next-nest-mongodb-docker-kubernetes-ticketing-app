import { IsNotEmpty, Min } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Min(0)
  price: number;
}
