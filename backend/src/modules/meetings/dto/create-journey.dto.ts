import { IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class CreateJourneyDto {
  @IsMongoId()
  tenantId: string;

  @IsMongoId()
  collaboratorId: string;

  @IsMongoId()
  managerId: string;

  @IsNumber()
  @Min(2020)
  @Max(2100)
  year: number;
}
