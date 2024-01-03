export interface IOrderCancelledEvent {
  id: string;
  version?: number;
  ticket: {
    id: string;
  };
}

export class OrderCancelledEvent {
  constructor(private readonly props: IOrderCancelledEvent) {}

  toString() {
    console.debug('OrderCancelledEvent', this.props);

    return JSON.stringify({ ...this.props });
  }
}
