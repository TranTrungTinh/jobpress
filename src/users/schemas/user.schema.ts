import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TUserSlice } from 'src/enums/schema.enums';

export type UserDocument = HydratedDocument<User> & User;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  company: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  role: Types.ObjectId;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object })
  createdBy: TUserSlice;

  @Prop({ type: Object })
  updatedBy: TUserSlice;

  @Prop({ type: Object })
  deletedBy: TUserSlice;

  @Prop()
  isDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
