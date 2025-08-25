import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const usersRepository = {
  async findByEmailOrLogin(loginOrEmail: string): Promise<WithId<User> | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (user) {
      return user;
    }

    return null;
  },

  async create(user: User): Promise<string> {
    const insertedResult = await userCollection.insertOne(user);

    return insertedResult.insertedId.toString();
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Blog not exist');
    }
  },
};
