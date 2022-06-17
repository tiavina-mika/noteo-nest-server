import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLError,
  GraphQLFormattedError,
} from 'graphql';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';
import { upperDirectiveTransformer } from './common/directive/upper-case.directive';
import { FolderModule } from './folder/folder.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { formatGraphQLErrorMessage } from './utils/errors';
import { DatabaseService } from './database/service/database.service';
import { DatabaseModule } from './database/database.module';
import { DebuggerOptionService } from './debugger/service/debugger.option.service';
import { DebuggerModule } from './debugger/debugger.module';
import { HelperModule } from './utils/helper/helper.module';
import { RequestModule } from './utils/request/request.module';
import { PaginationModule } from './utils/pagination/pagination.module';
import Configs from 'src/config/index';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      ignoreEnvFile: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      formatError: (error: GraphQLError) => {
        const customError = formatGraphQLErrorMessage(error);
        if (customError) {
          new Error(customError);
        } else if (error.message === 'VALIDATION_ERROR') {
          const extensions = {
            code: 'VALIDATION_ERROR',
            errors: [],
          };

          Object.keys(error.extensions.invalidArgs).forEach((key) => {
            const constraints = [];
            Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
              (_key) => {
                constraints.push(
                  error.extensions.invalidArgs[key].constraints[_key]
                );
              }
            );

            extensions.errors.push({
              field: error.extensions.invalidArgs[key].property,
              errors: constraints,
            });
          });

          const graphQLFormattedError: GraphQLFormattedError = {
            message: 'VALIDATION_ERROR',
            extensions: extensions,
          };

          return graphQLFormattedError;
        } else {
          return error;
        }
      },
    }),
    WinstonModule.forRootAsync({
      inject: [DebuggerOptionService],
      imports: [DebuggerModule],
      useFactory: (loggerService: DebuggerOptionService) =>
        loggerService.createLogger(),
    }),
    MongooseModule.forRootAsync({
      // connectionName: DATABASE_CONNECTION_NAME,
      inject: [DatabaseService],
      imports: [DatabaseModule],
      useFactory: (databaseService: DatabaseService) =>
        databaseService.createMongooseOptions(),
    }),
    HelperModule,
    AuthModule,
    UsersModule,
    NoteModule,
    FolderModule,
    DebuggerModule,
    RequestModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
