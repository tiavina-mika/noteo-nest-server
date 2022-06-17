import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateUserInput } from '../users/users.input';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('values') values: CreateUserInput) {
    return this.usersService.create(values);
  }

  @Query(() => [User])
  async getUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async getUserById(@Args('id') id: string) {
    return this.usersService.getById(id);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Mutation(() => Boolean)
  async deleteAllUsers() {
    return this.usersService.deleteAll();
  }
}
