import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';
import { BaseEntity } from '../../base.entity';
// import { Order } from './order.entity';
import { UserRepository } from '../user.repository';
import { IsUUID } from 'class-validator';
import { Order } from './order.entity';

@Entity({ repository: () => UserRepository, tableName: 'users' })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property()
  @Unique()
  @IsUUID()
  authId: string;

  @OneToMany(() => Order, (order) => order.user, { lazy: true })
  orders = new Collection<Order>(this);

  constructor(authId: string) {
    super();
    this.authId = authId;
  }
}
