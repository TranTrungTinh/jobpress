import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TCompanySlice, TUserSlice } from 'src/enums/schema.enums';

export type JobDocument = HydratedDocument<Job> & Job;

@Schema({
  timestamps: true,
})
export class Job {
  @Prop()
  name: string;

  @Prop()
  skill: string;

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({ type: Object })
  company: TCompanySlice;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: Object })
  createdBy: TUserSlice;

  @Prop({ type: Object })
  updatedBy: TUserSlice;

  @Prop({ type: Object })
  deletedBy: TUserSlice;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
