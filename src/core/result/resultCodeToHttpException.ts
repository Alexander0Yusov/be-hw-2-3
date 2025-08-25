import { ResultStatus } from './resultCode';
import { HttpStatus } from '../types/HttpStatus';

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.Success:
      return HttpStatus.Ok;

    case ResultStatus.NotFound:
      return HttpStatus.NotFound;

    case ResultStatus.Unauthorized:
      return HttpStatus.Unauthorized;

    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest;

    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden;

    default:
      return HttpStatus.InternalServerError;
  }
};
