import { Response, Request } from 'express';
import { HttpStatus } from '../../../core/types/HttpStatus';
import { authService } from '../../domain/auth.service';
import { RegistrationInputModel } from '../../types/registration-input-model';
import { usersQwRepository } from '../../../4-users/qw-repository/users-qw-repository';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function postAuthRegistrationHandler(req: Request<{}, {}, RegistrationInputModel>, res: Response) {
  const { login, email, password } = req.body;

  const existsLogin = await usersQwRepository.findByEmailOrLogin(login);
  const existsEmail = await usersQwRepository.findByEmailOrLogin(email);

  if (existsLogin || existsEmail) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages([{ field: 'Email or login', message: 'Email or login already exists' }]));
  }

  const newUser = await authService.registerUser(login, email, password);

  if (newUser.data) {
    res.sendStatus(HttpStatus.NoContent);
  }

  res
    .status(HttpStatus.BadRequest)
    .send(
      createErrorMessages([{ field: newUser.extensions[0].field || '', message: newUser.extensions[0].message || '' }]),
    );
}
