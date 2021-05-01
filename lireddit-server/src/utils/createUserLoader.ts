import DataLoader from "dataloader";
import { User } from "../entities/User";

// we want to create one of these utilities on every single request, so we use this utility function for that
// [1, 7, 8, 9]
// [{id: 1, username: 'user1'}, {id: 7, username: 'user7'}, {id: 8, username: 'user8'}, {id: 9, username: 'user9'}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId])
  });
