import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class CreateJobRoleDto {
  @IsMongoId()
  tenantId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateJobRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
