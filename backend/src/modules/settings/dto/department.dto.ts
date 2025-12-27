import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
  @IsMongoId()
  tenantId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  managerId?: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  managerId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
