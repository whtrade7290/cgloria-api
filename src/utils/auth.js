import jwt from 'jsonwebtoken';
import { SECRET_KEY, EXPIRATION_DATE } from '../config/index.js';

export const newToken = user => {
  const payload = {
    username: user.username,
    _id: user._id,
  };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRATION_DATE,
  });
};