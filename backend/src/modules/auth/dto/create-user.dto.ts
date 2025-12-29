import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsMongoId()
  tenantId: string;

  @IsEnum(['manager', 'employee'])
  role: string;

  @IsOptional()
  @IsEnum(['pt', 'en', 'es'], { message: 'Language must be pt, en, or es' })
  preferredLanguage?: string;

  @IsOptional()
  @IsMongoId()
  jobRoleId?: string;

  @IsOptional()
  @IsMongoId()
  departmentId?: string;

  @IsOptional()
  @IsMongoId()
  managerId?: string;
}
