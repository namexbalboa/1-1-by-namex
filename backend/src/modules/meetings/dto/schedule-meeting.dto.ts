import { IsMongoId, IsDateString, IsString } from 'class-validator';

export class ScheduleMeetingDto {
  @IsMongoId()
  tenantId: string;

  @IsMongoId()
  collaboratorId: string;

  @IsMongoId()
  managerId: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string; // Format: "HH:mm" (e.g., "14:30")
}
