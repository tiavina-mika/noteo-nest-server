import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth/auth.service';
import { LoginInput, LoginResult } from './auth.input';
import { User } from '../users/users.schema';
import { CreateUserInput } from '../users/users.input';
import { UsersService } from '../users/users.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver((of) => User)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Mutation((returns) => LoginResult)
  async login(@Args('values') values: LoginInput) {
    const user = await this.authService.validateUserByPassword(values);

    const token = this.authService.createJwt(user).token;

    user.updatedAt = new Date();
    user.save();

    return {
      token,
      user,
    };
  }

  @Mutation((returns) => User)
  async signup(@Args('values') values: CreateUserInput) {
    const newValues = {
      ...values,
      password: bcrypt.hashSync(values.password, 10),
    };
    return this.usersService.create(newValues);
  }

  @Query((returns) => User)
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: User) {
    return this.usersService.getById(user.id.toString());
  }
}
