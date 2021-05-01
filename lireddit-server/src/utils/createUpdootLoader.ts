import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";

const updootKeyBuilder = (updoot: Partial<Updoot>): string => {
  return `${updoot.userId}|${updoot.postId}`;
};

// we want to create one of these utilities on every single request, so we use this utility function for that
// we send [{postId: 5, userId: 10}]
// then return [{postId: 5, userId: 10, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[updootKeyBuilder(updoot)] = updoot;
      });

      return keys.map((key) => updootIdsToUpdoot[updootKeyBuilder(key)]);
    }
  );
