import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';

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

  // @UseGuards(AuthGuard('local'))
  @Mutation((returns) => User)
  async login(@Args('values') values: LoginInput) {
    const user = await this.usersService.findOneByEmail(
      values.email.toLowerCase()
    );

    const isValidPassword = bcrypt.compareSync(values.password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  @Mutation((returns) => User)
  async signup(@Args('values') values: CreateUserInput) {
    const newValues = {
      ...values,
      password: bcrypt.hashSync(values.password, 10),
    };
    return this.usersService.create(newValues);
  }
}
