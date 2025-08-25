import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { UserViewModel } from '../types/user-view-model';
import { UserQueryInput } from '../router/input/user-query.input';
import { mapToUserViewModel } from '../mappers/map-to-user-view-model.util';

export const usersQwRepository = {
  async findById(id: string): Promise<UserViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (user) {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }

    return null;
  },

  async findByEmailOrLogin(loginOrEmail: string): Promise<string | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (user) {
      return user._id.toString();
    }

    return null;
  },

  async findHashById(id: string): Promise<string> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error('Hash not found');
    }

    return user.passwordHash;
  },

  async findMany(queryDto: UserQueryInput): Promise<any> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const filter: any = {};
    const orConditions: any[] = [];

    if (searchLoginTerm) {
      orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
      orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: items.map(mapToUserViewModel),
    };
  },
};
