export interface ITicketUpdatedEvent {
  id: string;
  version?: number;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

export class TicketUpdatedEvent {
  constructor(private readonly props: ITicketUpdatedEvent) {}

  toString() {
    console.debug('TicketUpdatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
