import client from '../../client';
import { authGuard } from '../users.utils';

export default {
  Query: {
    myProfile: authGuard(async (_, args, { loggedInUser }) => {
      const user = await client.user.findUnique({
        where: { id: loggedInUser.id },
      });
      return user;
    }),
  },
};
