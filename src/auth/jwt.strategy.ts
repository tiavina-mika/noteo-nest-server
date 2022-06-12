import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.input';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    console.log('payload: ', payload);
    const user = await this.authService.validateJwtPayload(payload);
    console.log('user: ', user);
    if (!user) {
      throw new UnauthorizedException(
        'Could not log-in with the provided credentials'
      );
    }
    return user;
  }
}
