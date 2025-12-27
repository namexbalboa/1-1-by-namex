import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Company name must be at least 3 characters long' })
  companyName: string;

  @IsOptional()
  @IsEnum(['pt', 'en', 'es'], { message: 'Language must be pt, en, or es' })
  preferredLanguage?: string;
}
