/* eslint-disable prettier/prettier */
import { Types }  from 'mongoose';
// TODO: Mongoose string to ObjectId function

export const toObjectId = (id: string) => {
  // check is valid ObjectId
  if (!Types.ObjectId.isValid(id)) return null;
  return new Types.ObjectId(id);
};
