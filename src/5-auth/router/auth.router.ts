import { Router } from 'express';
import { errorsCatchMiddleware } from '../../core/middlewares/validation/errors-catch.middleware';
import { accessTokenGuard } from './guards/access.token.guard';
import { getAuthMeHandler, postAuthHandler, postAuthRegistrationHandler } from './handlers';
import { loginOrEmailDtoValidationMiddleware } from '../validation/login-or-email-dto-validation.middleware';
import { passwordDtoValidationMiddleware } from '../validation/password-dto-validation.middleware';
import { userDtoValidationMiddleware } from '../../4-users/validation/user-dto-validation.middleware';

export const authRouter = Router({});

authRouter.post(
  '/login',
  loginOrEmailDtoValidationMiddleware,
  passwordDtoValidationMiddleware,
  errorsCatchMiddleware,
  postAuthHandler,
);

authRouter.get('/me', accessTokenGuard, getAuthMeHandler);

//
authRouter.post('/registration', userDtoValidationMiddleware, errorsCatchMiddleware, postAuthRegistrationHandler);
// authRouter.get('/registration-confirmation', accessTokenGuard, getAuthMeHandler);
// authRouter.get('/registration-email-resending', accessTokenGuard, getAuthMeHandler);
