import { IsString, IsEmail, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateCollaboratorDto {
  @IsMongoId()
  tenantId: string;

  @IsString()
  firebaseUid: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['manager', 'employee'])
  role: string;

  @IsOptional()
  @IsMongoId()
  managerId?: string;

  @IsOptional()
  @IsEnum(['pt', 'en', 'es'])
  preferredLanguage?: string;
}
