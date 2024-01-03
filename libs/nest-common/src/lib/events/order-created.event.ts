import { OrderStatus } from './index';

export interface IOrderCreatedEvent {
  id: string;
  version?: number;
  status: OrderStatus;
  userId: string;
  expiresAt: string;
  ticket: {
    id: string;
    price: number;
  };
}

export class OrderCreatedEvent {
  constructor(private readonly props: IOrderCreatedEvent) {}

  toString() {
    console.debug('OrderCreatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
