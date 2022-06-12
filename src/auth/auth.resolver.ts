import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../auth/auth.service';
import { LoginInput } from './auth.input';
import { User } from '../users/users.schema';
import { CreateUserInput } from '../users/users.input';
import { UsersService } from '../users/users.service';

@Resolver((of) => User)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Mutation((returns) => User)
  async login(@Args('values') values: LoginInput) {
    return this.authService.validateUser(values);
  }

  @Mutation((returns) => User)
  async signup(@Args('values') values: CreateUserInput) {
    return this.usersService.create(values);
  }
}
