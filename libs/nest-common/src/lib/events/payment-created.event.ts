import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export interface IPaymentCreatedEvent {
  orderId: string;
  version?: number;
}

export class PaymentCreatedEventDto implements IPaymentCreatedEvent {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  @Min(0)
  version?: number;
}
