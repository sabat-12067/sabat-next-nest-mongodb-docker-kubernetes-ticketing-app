export interface ITicketCreatedEvent {
  id: string;
  version?: number;
  title: string;
  price: number;
  userId: string;
}

export class TicketCreatedEvent {
  constructor(private readonly props: ITicketCreatedEvent) {}

  toString() {
    console.debug('TicketCreatedEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
