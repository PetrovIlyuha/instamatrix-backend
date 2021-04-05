import client from '../../client';
import bcrypt from 'bcrypt';
import { authGuard } from '../users.utils';
import { createWriteStream } from 'fs';
import path from 'path';

const editProfileFn = async (
  _,
  { firstName, lastName, username, email, password, bio, avatar },
  { loggedInUser },
) => {
  try {
    let avatarUrl = null;
    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const savedFileName = `${loggedInUser.id}-${filename}`;
      const uploadPath = path.join(process.cwd(), 'uploads', savedFileName);
      const incomingImageStream = createReadStream();
      const saveImageStream = createWriteStream(uploadPath);
      incomingImageStream.pipe(saveImageStream);
      avatarUrl = `http://localhost:4000/static/${savedFileName}`;
    }
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        firstName,
        lastName,
        username,
        email,
        bio,
        ...(avatar && { avatar: avatarUrl }),
        ...(hashedPassword && { password: hashedPassword }),
      },
    });
    return { ok: true, error: 'Clean, no errors' };
  } catch (err) {
    console.log(err);
    return { ok: false, error: 'User update failed!' };
  }
};

export default {
  Mutation: {
    editProfile: authGuard(editProfileFn),
  },
};
