import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TagDocument = Tag & Document;

class TagLabel {
  @Prop({ required: true })
  pt: string;

  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  es: string;
}

@Schema({ timestamps: true })
export class Tag {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, enum: ['blocker', 'learning'], required: true })
  category: string;

  @Prop({ type: TagLabel, required: true })
  labels: TagLabel;

  @Prop({ default: true })
  isActive: boolean;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

// Indexes
TagSchema.index({ tenantId: 1, category: 1 });
TagSchema.index({ isActive: 1 });
