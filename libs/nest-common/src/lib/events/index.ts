export enum Topics {
  TicketCreated = 'ticket_created',
  TicketUpdated = 'ticket_updated',
  OrderCreated = 'order_created',
  OrderCancelled = 'order_cancelled',
  ExpirationComplete = 'expiration_complete',
}

export enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved
  CREATED = 'created',

  // The ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order.
  // The order expires before payment
  CANCELLED = 'cancelled',

  // The order has successfully reserved the ticket
  AWAITING_PAYMENT = 'awaiting:payment',

  // The order has reserved the ticket and the user has
  // provided payment successfully
  COMPLETE = 'complete',
}

export * from './ticket-created.event';
export * from './ticket-updated.event';
export * from './order-created.event';
export * from './order-cancelled.event';
