import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthService } from '../auth/auth.service';
import { LoginInput, LoginResult } from './auth.input';
import { User } from '../users/users.schema';
import { CreateUserInput } from '../users/users.input';
import { UsersService } from '../users/users.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/users/users.constant';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Mutation(() => LoginResult)
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

  @Mutation(() => User)
  async signup(@Args('values') values: CreateUserInput) {
    const user = await this.usersService.findOneByEmail(values.email);

    if (user) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
        message: 'user.error.exist',
      });
    }
    const newValues = {
      ...values,
      password: bcrypt.hashSync(values.password, 10),
    };

    return this.usersService.create(newValues);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: User) {
    return this.usersService.getById(user.id.toString());
  }
}
