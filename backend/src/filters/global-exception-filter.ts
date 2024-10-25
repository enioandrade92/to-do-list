import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        console.log(exception);
        const status: number = exception?.response?.statusCode
            ? exception.response.statusCode
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message: string = exception?.response?.message
            ? exception.response.message
            : 'Internal server error';

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
        });
    }
}
