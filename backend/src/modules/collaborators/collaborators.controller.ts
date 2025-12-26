import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto, UpdateLanguageDto } from './dto/update-collaborator.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.collaboratorsService.findAll(tenantId);
  }

  @Get('firebase/:uid')
  findByFirebaseUid(@Param('uid') uid: string) {
    return this.collaboratorsService.findByFirebaseUid(uid);
  }

  @Get('manager/:managerId')
  findByManager(@Param('managerId') managerId: string) {
    return this.collaboratorsService.findByManager(managerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collaboratorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollaboratorDto: UpdateCollaboratorDto) {
    return this.collaboratorsService.update(id, updateCollaboratorDto);
  }

  @Patch(':id/language')
  updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.collaboratorsService.updateLanguage(id, updateLanguageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.collaboratorsService.remove(id);
  }
}
