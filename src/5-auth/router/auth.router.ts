import { Router } from 'express';
import { errorsCatchMiddleware } from '../../core/middlewares/validation/errors-catch.middleware';
import { authDtoValidationMiddleware } from '../validation/auth-dto-validation.middleware';
import { accessTokenGuard } from './guards/access.token.guard';
import { getAuthMeHandler, postAuthHandler } from './handlers';

export const authRouter = Router({});

authRouter.post('/login', authDtoValidationMiddleware, errorsCatchMiddleware, postAuthHandler);

authRouter.get('/me', accessTokenGuard, getAuthMeHandler);
