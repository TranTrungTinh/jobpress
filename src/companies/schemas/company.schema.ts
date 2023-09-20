import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TUserSlice } from 'src/enums/schema.enums';

export type CompanyDocument = HydratedDocument<Company> & Company;

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop()
  logo: string;

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

export const CompanySchema = SchemaFactory.createForClass(Company);
