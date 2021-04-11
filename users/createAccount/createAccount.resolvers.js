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
          if (firstName < 2) {
            return {
              ok: false,
              error: 'First name is too short. 2 characters min',
            };
          }
          if (username.length < 3) {
            return {
              ok: false,
              error: 'Username too short. 3 characters min',
            };
          }
          if (password.length < 6) {
            return {
              ok: false,
              error: 'Password should be longer than 6 characters',
            };
          }
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
