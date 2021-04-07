import jwt from 'jsonwebtoken';
import client from '../client';

export async function getUser(token) {
  try {
    if (!token) {
      return null;
    } else {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await client.user.findUnique({ where: { id } });
      if (user) {
        return user;
      } else {
        return null;
      }
    }
  } catch (err) {
    return null;
  }
}

export const authGuard = resolver => (root, args, context, info) => {
  if (!context.loggedInUser) {
    const isQuery = info.operation.operation === 'query';
    if (isQuery) {
      return null;
    } else {
      return {
        ok: false,
        error: 'You are not logged in!',
      };
    }
  }
  return resolver(root, args, context, info);
};
