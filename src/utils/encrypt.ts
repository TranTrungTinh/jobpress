/* eslint-disable prettier/prettier */
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const hashPasswordSync = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

export const comparePassword = async (rawPassword: string, hash: string) => {
  return await compare(rawPassword, hash);
};
