import { EntityRepository } from '@mikro-orm/mongodb';
import { User } from './entities/user.entity';
import { validate } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

export class UserRepository extends EntityRepository<User> {
  async findOrCreate(authId: string) {
    const user = await this.findOne({ authId });

    if (!user) {
      const newUser = new User(authId);
      const errors = await validate(newUser);

      if (errors.length > 0) {
        throw new InternalServerErrorException('Invalid user data');
      }
      await this.em.persistAndFlush(newUser);
      return user;
    }
    return user;
  }
}
