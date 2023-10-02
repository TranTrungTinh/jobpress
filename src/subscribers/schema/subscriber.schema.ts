import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TUserSlice } from 'src/enums/schema.enums';

export type SubscriberDocument = HydratedDocument<Subscriber> & Subscriber;

@Schema({
  timestamps: true,
  collection: 'subscribers',
})
export class Subscriber {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Array })
  skill: string[];

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

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
