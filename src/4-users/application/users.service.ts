import { usersRepository } from '../repository/users.repository';
import { User } from '../types/user';
import { UserInputModel } from '../types/user-iput-model';
import bcrypt from 'bcrypt';

export const usersService = {
  async create(dto: UserInputModel): Promise<string> {
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const newUser: User = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
    };

    const newUserId = await usersRepository.create(newUser);

    return newUserId;
  },

  async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
    return;
  },
};
