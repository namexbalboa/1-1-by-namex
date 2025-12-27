import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CollaboratorDocument = Collaborator & Document;

@Schema({ timestamps: true })
export class Collaborator {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  firebaseUid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, enum: ['manager', 'employee'], required: true })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Collaborator' })
  managerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'JobRole' })
  jobRoleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  departmentId: Types.ObjectId;

  @Prop({ type: String, enum: ['pt', 'en', 'es'], default: 'pt' })
  preferredLanguage: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CollaboratorSchema = SchemaFactory.createForClass(Collaborator);

// Indexes
CollaboratorSchema.index({ tenantId: 1, email: 1 }, { unique: true });
CollaboratorSchema.index({ firebaseUid: 1 }, { unique: true });
CollaboratorSchema.index({ managerId: 1 });
CollaboratorSchema.index({ tenantId: 1, isActive: 1 });
