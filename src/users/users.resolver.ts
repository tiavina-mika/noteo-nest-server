import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateUserInput } from '../users/users.input';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation((returns) => User)
  async createUser(@Args('values') values: CreateUserInput) {
    return this.usersService.create(values);
  }

  @Query((returns) => [User])
  async getUsers() {
    return this.usersService.findAll();
  }

  @Query((returns) => User)
  async getUserById(@Args('id') id: string) {
    return this.usersService.getById(id);
  }

  @Mutation((returns) => User)
  async deleteUser(@Args('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Mutation((returns) => Boolean)
  async deleteAllUsers() {
    return this.usersService.deleteAll();
  }
}
