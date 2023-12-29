import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder, Factory, Faker } from '@mikro-orm/seeder';
import { Ticket } from '../app/orders/entities/ticket.entity';
import { Order, OrderStatus } from '../app/orders/entities/order.entity';

export class TicketFactory extends Factory<Ticket> {
  model = Ticket;

  definition(faker: Faker): Partial<Ticket> {
    return {
      price: Number(faker.finance.amount()),
      title: faker.lorem.sentence(),
    };
  }
}

export class OrderFactory extends Factory<Order> {
  model = Order;

  definition(faker: Faker): Partial<Order> {
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60);
    return {
      userId: faker.database.mongodbObjectId(),
      status: OrderStatus.CREATED,
      expiresAt: expiration,
    };
  }
}

export class TicketSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // save the entity to the context
    context.tickets = new TicketFactory(em).make(5);
  }
}

export class OrderSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    for (const ticket of context.tickets) {
      new OrderFactory(em).makeOne({ ticket });
    }
  }
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [TicketSeeder, OrderSeeder]);
  }
}
