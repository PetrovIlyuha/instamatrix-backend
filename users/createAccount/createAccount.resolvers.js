import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existingUser) {
          throw new Error('User already exists!');
        } else {
          const hashPassword = await bcrypt.hash(password, 10);
          const user = await client.user.create({
            data: {
              username,
              email,
              firstName,
              lastName,
              password: hashPassword,
            },
          });
          return { ok: true, user, error: null };
        }
      } catch (err) {
        return { ok: false, error: err };
      }
    },
  },
};
