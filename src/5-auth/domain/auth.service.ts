import { WithId } from 'mongodb';
import { jwtService } from '../adapters/jwt.service';
import { ResultStatus } from '../../core/result/resultCode';
import { Result } from '../../core/result/result.type';
import { bcryptService } from '../adapters/bcrypt.service';

import { usersRepository } from '../../4-users/repository/users.repository';
import { User } from '../../4-users/types/user';
import { usersService } from '../../4-users/application/users.service';
import { nodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../adapters/email-examples';

export const authService = {
  async loginUser(loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);

    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };

    const accessToken = await jwtService.createToken(result.data!._id.toString());

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<User> | null>> {
    const user = await usersRepository.findByEmailOrLogin(loginOrEmail);

    if (!user)
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };

    const isPassCorrect = await bcryptService.checkPassword(password, user.accountData.passwordHash);

    if (!isPassCorrect)
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },

  async registerUser(login: string, email: string, password: string): Promise<Result<WithId<User> | null>> {
    const userId = await usersService.create({ login, email, password });
    const user = await usersRepository.findById(userId);

    try {
      await nodemailerService.sendEmail(
        user!.accountData.email,
        user!.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      );

      return {
        status: ResultStatus.Success,
        data: user,
        extensions: [],
      };
    } catch (error) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'Internal error', message: 'Mail service error' }],
      };
    }
  },

  async confirmEmail(code: string): Promise<boolean> {
    // поиск по коду

    // условие на совпадение кода и времени экспирации
    if (true) {
      // исправление статуса
      return true;
    }

    return false;
  },
};
