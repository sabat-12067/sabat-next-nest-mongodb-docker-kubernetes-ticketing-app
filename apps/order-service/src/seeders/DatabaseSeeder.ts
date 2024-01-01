import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder, Factory, Faker } from '@mikro-orm/seeder';
import { Ticket } from '../app/orders/entities/ticket.entity';
import { Order, OrderStatus } from '../app/orders/entities/order.entity';
import { User } from '../app/orders/entities/user.entity';

export class TicketFactory extends Factory<Ticket> {
  model = Ticket;

  definition(faker: Faker): Partial<Ticket> {
    return {
      price: Number(faker.finance.amount()),
      title: faker.lorem.sentence(),
    };
  }
}

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      authId: faker.datatype.uuid(),
    };
  }
}

export class OrderFactory extends Factory<Order> {
  model = Order;

  definition(_faker: Faker): Partial<Order> {
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60);
    return {
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

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // save the entity to the context
    context.users = new UserFactory(em).make(3);
  }
}

export class OrderSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    for (let index = 0; index < 3; index++) {
      const ticket = context.tickets[index];
      const user = context.users[index];

      new OrderFactory(em).makeOne({ ticket, user });
    }
  }
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [TicketSeeder, UserSeeder, OrderSeeder]);
  }
}
