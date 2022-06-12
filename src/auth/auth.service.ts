import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInput } from './auth.input';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(values: LoginInput): Promise<any> {
    const user = await this.usersService.findOneByEmail(values.email);
    if (user && user.password === values.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
