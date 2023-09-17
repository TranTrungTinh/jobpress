/* eslint-disable prettier/prettier */
import { Types }  from 'mongoose';
import { IUser } from 'src/users/schemas/users.interface';
// TODO: Mongoose string to ObjectId function

export const toObjectId = (id: string) => {
  // check is valid ObjectId
  if (!isValidObjectId(id)) return null;
  return new Types.ObjectId(id);
};

export const isValidObjectId = (id: string) => {
  return Types.ObjectId.isValid(id);
};

export const toObjectUser = (user: IUser) => {
  return {
    _id: toObjectId(user._id),
    email: user.email,
  };
}