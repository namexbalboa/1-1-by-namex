import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { CreateCollaboratorDto } from './create-collaborator.dto';

export class UpdateCollaboratorDto extends PartialType(CreateCollaboratorDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLanguageDto {
  @IsEnum(['pt', 'en', 'es'])
  preferredLanguage: string;
}
