import { WithId } from 'mongodb';
import { User } from '../types/user';
import { UserViewModel } from '../types/user-view-model';

export function mapToUserViewModel(item: WithId<User>): UserViewModel {
  return {
    id: item._id.toString(),
    login: item.login,
    email: item.email,
    createdAt: item.createdAt,
  };
}
