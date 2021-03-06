import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/users/users.schema';

import { UsersService } from '../users/users.service';
import { JwtPayload, LoginInput } from './auth.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private _jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUserByPassword(values: LoginInput): Promise<any> {
    const user = await this.usersService.findOneByEmail(
      values.email.toLowerCase()
    );
    const isValidPassword = bcrypt.compareSync(values.password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  /**
   * Verifies that the JWT payload associated with a JWT is valid by making sure the user exists and is enabled
   *
   * @param {JwtPayload} payload
   * @returns {(Promise<UserDocument | undefined>)} returns undefined if there is no user or the account is not enabled
   * @memberof {(AuthService JwtStrategy)}
   */
  async validateJwtPayload(payload: JwtPayload): Promise<User | undefined> {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findOneByEmail(payload.email);

    // Ensure the user exists and their account isn't disabled
    if (user && user.enabled) {
      user.updatedAt = new Date();
      user.save();
      return user;
    }

    return undefined;
  }

  createJwt(user: User): { data: JwtPayload; token: string } {
    const expiresIn = this.configService.jwtExpiresIn;
    let expiration: Date | undefined;
    if (expiresIn) {
      expiration = new Date();
      expiration.setTime(expiration.getTime() + expiresIn * 1000);
    }
    const data: JwtPayload = {
      email: user.email,
      id: user.id,
      expiration,
    };

    const jwt = this._jwtService.sign(data);

    return {
      data,
      token: jwt,
    };
  }
}
