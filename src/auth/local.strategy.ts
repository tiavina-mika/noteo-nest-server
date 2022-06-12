import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './auth.input';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(values: LoginInput): Promise<any> {
    const user = await this.authService.validateUser(values);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
