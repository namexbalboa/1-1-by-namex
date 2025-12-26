import {
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  Min,
  Max,
  ValidateNested,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActionItemDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['done', 'pending', 'blocked'])
  status?: string;
}

export class PulseHistoryItemDto {
  @IsNumber()
  week: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  value: number;
}

export class TimeDistributionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  execution: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  meetings: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  resolution: number;
}

export class BlockersDto {
  @IsEnum(['green', 'yellow', 'red'])
  level: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class BlockADto {
  @ValidateNested()
  @Type(() => TimeDistributionDto)
  timeDistribution: TimeDistributionDto;

  @ValidateNested()
  @Type(() => BlockersDto)
  blockers: BlockersDto;

  @IsNumber()
  @Min(1)
  @Max(5)
  toolAdequacy: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  priorityClarity: number;
}

export class BlockBDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  goalConnection: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  autonomy: number;

  @IsBoolean()
  innovation: boolean;
}

export class BlockCDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  psychologicalSafety: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  collaborationFriction: number;

  @IsEnum(['low', 'medium', 'high'])
  recognition: string;
}

export class IntellectualChallengeDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  skill: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  challenge: number;
}

export class BlockDDto {
  @ValidateNested()
  @Type(() => IntellectualChallengeDto)
  intellectualChallenge: IntellectualChallengeDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  strengthsUtilization: number;

  @IsArray()
  @IsString({ each: true })
  activeLearning: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  mentalHealth: number;

  @IsString()
  @MaxLength(200)
  biweeklyFocus: string;
}

export class CreateMeetingDto {
  @IsNumber()
  meetingNumber: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionItemDto)
  actionItems?: ActionItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PulseHistoryItemDto)
  pulseHistory?: PulseHistoryItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockADto)
  blockA?: BlockADto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockBDto)
  blockB?: BlockBDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockCDto)
  blockC?: BlockCDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockDDto)
  blockD?: BlockDDto;
}
