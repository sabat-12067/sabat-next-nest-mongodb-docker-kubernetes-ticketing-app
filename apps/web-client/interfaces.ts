export interface Ticket {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  expiresAt: string;
  ticket: {
    id: string;
    createdAt: string;
    title: string;
    price: number;
  };
  userId: string;
}
