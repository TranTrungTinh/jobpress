/* eslint-disable prettier/prettier */
import { Types } from 'mongoose';

export type TUserSlice = {
  _id: Types.ObjectId;
  email: string;
};

export type TCompanySlice = {
  _id: Types.ObjectId;
  name: string;
};
