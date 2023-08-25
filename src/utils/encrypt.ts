/* eslint-disable prettier/prettier */
import { genSalt, hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const comparePassword = async (rawPassword: string, hash: string) => {
  return await compare(rawPassword, hash);
};
