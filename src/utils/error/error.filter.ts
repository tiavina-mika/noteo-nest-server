import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from 'src/message/service/message.service';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { GraphQLResolveInfo } from 'graphql';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class ErrorHttpFilter implements ExceptionFilter, GqlExceptionFilter {
  constructor(private readonly messageService: MessageService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    console.log('exception: ', exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();
    const i18n = getI18nContextFromArgumentsHost(host);

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // tslint:disable-next-line: no-console
      console.error(exception);
    }

    const message =
      (await this.messageService.get(exception.message, {
        appLanguage: i18n.lang,
      })) || null;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      error:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? message
          : 'Internal server error',
    };

    // This is for REST petitions
    if (request) {
      const error = {
        ...errorResponse,
        path: request.url,
        method: request.method,
      };

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(error),
        'ExceptionFilter'
      );

      response.status(status).json(errorResponse);
    } else {
      // This is for GRAPHQL petitions
      const error = {
        ...errorResponse,
        type: info.parentType,
        field: info.fieldName,
      };

      Logger.error(
        `${info.parentType} ${info.fieldName}`,
        JSON.stringify(error),
        'ExceptionFilter'
      );

      exception.message = message;
      return exception;
    }
  }
}

// @Catch(HttpException)
// export class ErrorHttpFilter implements ExceptionFilter {
//   constructor(private readonly messageService: MessageService) {}

//   async catch(exception: HttpException, host: ArgumentsHost): Promise<any> {
//     const ctx: HttpArgumentsHost = host.switchToHttp();
//     const statusHttp: number = exception.getStatus();
//     const responseHttp: any = ctx.getResponse<Response>();
//     console.log('ctx: ', ctx);
//     console.log('responseHttp: ', responseHttp);
//     const gqlHost = GqlArgumentsHost.create(host);
//     console.log('gqlHost: ', gqlHost);
//     const i18n = getI18nContextFromArgumentsHost(host);

//     const appLanguages: string[] = i18n
//       ? [i18n.lang]
//       : undefined;

//     // Restructure
//     const response = exception.getResponse() as IErrorException;
//     if (typeof response === 'object') {
//       const { statusCode, message, errors, data, properties } = response;
//       console.log('message: ', message);
//       const rErrors = errors
//         ? await this.messageService.getRequestErrorsMessage(
//             errors,
//             appLanguages
//           )
//         : undefined;

//       let rMessage: string | IMessage = await this.messageService.get(message, {
//         appLanguages,
//       });
//       console.log('rMessage: ', rMessage);

//       if (properties) {
//         rMessage = await this.messageService.get(message, {
//           appLanguages,
//           properties,
//         });
//       }

//       const graphQLFormattedError: GraphQLFormattedError = {
//         message: rMessage as string,
//         extensions: {},
//       };
//       console.log('graphQLFormattedError: ', {
//         errors: [
//           graphQLFormattedError
//         ]
//       });
//       return {
//         errors: [
//           graphQLFormattedError
//         ]
//       }
//       // responseHttp.status(statusHttp).json({
//       //   statusCode,
//       //   message: rMessage,
//       //   errors: rErrors,
//       //   data,
//       // });
//     } else {
//       const rMessage: string | IMessage = await this.messageService.get(
//         'response.error.structure',
//         { appLanguages }
//       );
//       responseHttp.status(statusHttp).json({
//         statusCode: 500,
//         message: rMessage,
//       });
//     }
//   }
// }
