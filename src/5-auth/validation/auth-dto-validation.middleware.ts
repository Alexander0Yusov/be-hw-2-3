import { body } from 'express-validator';

export const authDtoValidationMiddleware = [
  body('loginOrEmail')
    .isString()
    .withMessage('Ожидается строка')
    .trim()
    .notEmpty()
    .withMessage('Логин или имейл обязательный'),

  body('password')
    .isString()
    .withMessage('Ожидается строка')
    .trim()
    .notEmpty()
    .withMessage('Пароль обязательный')
    .isLength({ min: 6, max: 20 })
    .withMessage('Минимум 6, максимум 20 символов'),
];
