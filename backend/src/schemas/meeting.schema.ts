import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Sub-schemas
class ActionItem {
  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: ['done', 'pending', 'blocked'], default: 'pending' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

class PulseHistoryItem {
  @Prop({ required: true })
  week: number;

  @Prop({ required: true, min: 1, max: 5 })
  value: number;
}

class TimeDistribution {
  @Prop({ required: true, min: 0, max: 100 })
  execution: number;

  @Prop({ required: true, min: 0, max: 100 })
  meetings: number;

  @Prop({ required: true, min: 0, max: 100 })
  resolution: number;
}

class Blockers {
  @Prop({ type: String, enum: ['green', 'yellow', 'red'], default: 'green' })
  level: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

class BlockA {
  @Prop({ type: TimeDistribution })
  timeDistribution: TimeDistribution;

  @Prop({ type: Blockers })
  blockers: Blockers;

  @Prop({ min: 1, max: 5 })
  toolAdequacy: number;

  @Prop({ min: 1, max: 10 })
  priorityClarity: number;
}

class BlockB {
  @Prop({ min: 1, max: 5 })
  goalConnection: number;

  @Prop({ min: 0, max: 100 })
  autonomy: number;

  @Prop({ default: false })
  innovation: boolean;
}

class BlockC {
  @Prop({ min: 1, max: 5 })
  psychologicalSafety: number;

  @Prop({ min: 1, max: 10 })
  collaborationFriction: number;

  @Prop({ type: String, enum: ['low', 'medium', 'high'] })
  recognition: string;
}

class IntellectualChallenge {
  @Prop({ required: true, min: 1, max: 10 })
  skill: number;

  @Prop({ required: true, min: 1, max: 10 })
  challenge: number;
}

class BlockD {
  @Prop({ type: IntellectualChallenge })
  intellectualChallenge: IntellectualChallenge;

  @Prop({ min: 0, max: 100 })
  strengthsUtilization: number;

  @Prop({ type: [String], default: [] })
  activeLearning: string[];

  @Prop({ min: 1, max: 5 })
  mentalHealth: number;

  @Prop({ maxlength: 200 })
  biweeklyFocus: string;
}

class Meeting {
  @Prop({ required: true })
  meetingNumber: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: [ActionItem], default: [] })
  actionItems: ActionItem[];

  @Prop({ type: [PulseHistoryItem], default: [] })
  pulseHistory: PulseHistoryItem[];

  @Prop({ type: BlockA })
  blockA: BlockA;

  @Prop({ type: BlockB })
  blockB: BlockB;

  @Prop({ type: BlockC })
  blockC: BlockC;

  @Prop({ type: BlockD })
  blockD: BlockD;
}

export type MeetingJourneyDocument = MeetingJourney & Document;

@Schema({ timestamps: true })
export class MeetingJourney {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Collaborator', required: true })
  collaboratorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Collaborator', required: true })
  managerId: Types.ObjectId;

  @Prop({ required: true })
  year: number;

  @Prop({ type: [Meeting], default: [] })
  meetings: Meeting[];
}

export const MeetingJourneySchema = SchemaFactory.createForClass(MeetingJourney);

// Indexes
MeetingJourneySchema.index({ tenantId: 1, collaboratorId: 1, year: 1 }, { unique: true });
MeetingJourneySchema.index({ managerId: 1 });
MeetingJourneySchema.index({ year: 1 });
