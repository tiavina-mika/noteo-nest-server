import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';
import configuration from './env';
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLError,
  GraphQLFormattedError,
} from 'graphql';
import { upperDirectiveTransformer } from './common/directive/upper-case.directive';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from './folder/folder.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { formatGraphQLErrorMessage } from './utils/errors';

@Module({
  imports: [
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
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    NoteModule,
    FolderModule,
    AuthModule,
    UsersModule,
    // FolderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, FolderService],
})
export class AppModule {}
