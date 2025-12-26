import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsEnum(['pt', 'en', 'es'])
  defaultLanguage?: string;
}
