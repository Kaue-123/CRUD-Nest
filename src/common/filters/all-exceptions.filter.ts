import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { status, message, errors } = this.extractExceptionData(exception);

    res.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  private extractExceptionData(exception: unknown): {
    status: number;
    message: string;
    errors?: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const { message, errors } = response as {
          message?: string | string[];
          errors?: string | string[];
        };
        return {
          status,
          message: Array.isArray(message)
            ? message.join(', ')
            : message || 'Erro',
          errors: Array.isArray(errors) ? errors.join(', ') : errors,
        };
      }
      return {
        status,
        message: typeof response === 'string' ? response : 'Erro',
      };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }
}
