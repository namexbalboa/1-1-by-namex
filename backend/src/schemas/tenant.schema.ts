import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  logo: string;

  @Prop({ default: '#0EA5E9' })
  primaryColor: string;

  @Prop({ type: String, enum: ['pt', 'en', 'es'], default: 'pt' })
  defaultLanguage: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

// Indexes
TenantSchema.index({ name: 1 });
TenantSchema.index({ isActive: 1 });
