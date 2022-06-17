import { Logger, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env');
  const tz: string = configService.get<string>('app.timezone');
  const globalPrefix: string = configService.get<string>('app.globalPrefix');
  const versioning: boolean = configService.get<boolean>('app.versioning.on');
  const versioningPrefix: string = configService.get<string>(
    'app.versioning.prefix'
  );

  const logger = new Logger();
  process.env.TZ = tz;
  process.env.NODE_ENV = env;

  // Global Prefix
  app.setGlobalPrefix(globalPrefix);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Versioning
  if (versioning) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: VERSION_NEUTRAL,
      prefix: versioningPrefix,
    });
  }

  await app.listen(process.env.PORT || 8000);
  // console.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`==========================================================`);
  logger.log(`[App Environment]: ${env}`, 'NestApplication');
  logger.log(
    `[App Language]: ${configService.get<string>('app.language')}`,
    'NestApplication'
  );
  logger.log(
    `[App Debug]: ${configService.get<boolean>('app.debug')}`,
    'NestApplication'
  );
  logger.log(`[App Versioning]: ${versioning}`, 'NestApplication');
  logger.log(
    `[App Http]: ${configService.get<boolean>('app.httpOn')}`,
    'NestApplication'
  );
  logger.log(
    `[App Task]: ${configService.get<boolean>('app.taskOn')}`,
    'NestApplication'
  );
  logger.log(`[App Timezone]: ${tz}`, 'NestApplication');
  logger.log(
    `[Database Debug]: ${configService.get<boolean>('database.debug')}`,
    'NestApplication'
  );

  logger.log(`==========================================================`);

  logger.log(
    `[Database URI]: ${configService.get<string>(
      'database.host'
    )}/${configService.get<string>('database.name')}`,
    'NestApplication'
  );
  logger.log(`[Server]: ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();
