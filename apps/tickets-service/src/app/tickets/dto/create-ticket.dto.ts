import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @Min(0)
  price: number;
}
