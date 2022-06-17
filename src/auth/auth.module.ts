import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import configuration from 'src/config/configuration';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<any> => ({
        secret: configService.get<string>("auth.jwt.accessToken.secretKey"),
        signOptions: { expiresIn: configService.get<string>("auth.jwt.accessToken.expirationTime") },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
