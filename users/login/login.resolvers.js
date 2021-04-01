import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          return { ok: false, error: 'User not found' };
        }
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
          return {
            ok: false,
            error: "You've provided invalid password!",
          };
        }
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: '30d',
        });
        return {
          ok: true,
          token,
          error: null,
        };
      } catch (err) {
        return {
          ok: false,
          error: err,
        };
      }
    },
  },
};
