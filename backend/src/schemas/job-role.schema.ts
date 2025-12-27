import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobRoleDocument = JobRole & Document;

@Schema({ timestamps: true })
export class JobRole {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const JobRoleSchema = SchemaFactory.createForClass(JobRole);

// Indexes
JobRoleSchema.index({ tenantId: 1, name: 1 }, { unique: true });
JobRoleSchema.index({ tenantId: 1, isActive: 1 });
