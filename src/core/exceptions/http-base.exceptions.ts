import { HttpException } from '@nestjs/common';
import { HttpStatusCodeEnum, HttpStatusStringEnum } from '../enums/http-status.enum';


export class BaseHttpException {
  CheckErrors = (options: {
    httpStatusCode: HttpStatusCodeEnum;
    httpStatusString: HttpStatusStringEnum;
    message: string;
  }) => {
    throw new HttpException(
      {
        statusCode: options.httpStatusCode,
        error: options.httpStatusString,
        message: options.message,
      },
      options.httpStatusCode,
    );
  };
}