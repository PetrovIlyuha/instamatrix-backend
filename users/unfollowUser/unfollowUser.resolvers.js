import client from '../../client';
import { authGuard } from '../users.utils';

const unfollowUser = async (_, { username }, { loggedInUser }) => {
  try {
    const aboutToFollowUser = await client.user.findFirst({
      where: { username },
    });
    if (!aboutToFollowUser) {
      return {
        ok: false,
        error: 'User you wanted to unfollow is an ethereal ghost!',
      };
    }
    await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        following: {
          disconnect: {
            username,
          },
        },
      },
    });
    return {
      ok: true,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      error: err,
    };
  }
};

export default {
  Mutation: {
    unfollowUser: authGuard(unfollowUser),
  },
};
