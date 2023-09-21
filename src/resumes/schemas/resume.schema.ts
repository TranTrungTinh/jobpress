import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TUserSlice } from 'src/enums/schema.enums';

export type ResumeDocument = HydratedDocument<Resume> & Resume;

@Schema({
  timestamps: true,
})
export class Resume {
  @Prop({ required: true })
  url: string;

  @Prop()
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Job',
    required: true,
  })
  jobId: Types.ObjectId;

  @Prop({
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
  })
  status: string;

  // TODO: define history type is object array
  @Prop({
    type: [
      {
        status: { type: String },
        updateAt: { type: Date },
        updatedBy: { type: Object },
      },
    ],
  })
  history: {
    status: string;
    updateAt: Date;
    updatedBy: TUserSlice;
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: TUserSlice;

  @Prop({ type: Object })
  updatedBy: TUserSlice;

  @Prop({ type: Object })
  deletedBy: TUserSlice;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
