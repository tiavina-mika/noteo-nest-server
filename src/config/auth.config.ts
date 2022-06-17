import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY || '1234567',
        expirationTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '30m', // recommendation for production is 30m
        notBeforeExpirationTime: '0', // keep it in zero value
      },

      refreshToken: {
        secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY || '123456000',
        expirationTime: '7d', // recommendation for production is 7d
        expirationTimeRememberMe:
          process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED || '30d', // recommendation for production is 30d
        notBeforeExpirationTime:
          process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '30m', // recommendation for production is 30m
      },
    },

    password: {
      saltLength: 8,
      expiredInDay: 182, // recommendation for production is 182 days
    },
  })
);
