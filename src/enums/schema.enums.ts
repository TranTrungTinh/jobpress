import mongoose from 'mongoose';

export type TUserSlice = {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
};
