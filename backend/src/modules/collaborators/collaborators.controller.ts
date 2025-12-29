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
  UseGuards,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto, UpdateLanguageDto } from './dto/update-collaborator.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('collaborators')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('manager')
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  @Roles('manager')
  findAll(@Query('tenantId') tenantId?: string) {
    return this.collaboratorsService.findAll(tenantId);
  }

  @Get('firebase/:uid')
  findByFirebaseUid(@Param('uid') uid: string) {
    return this.collaboratorsService.findByFirebaseUid(uid);
  }

  @Get('manager/:managerId')
  @Roles('manager')
  findByManager(@Param('managerId') managerId: string) {
    return this.collaboratorsService.findByManager(managerId);
  }

  @Get(':id')
  // Both managers and employees can view (employees restricted to own profile in service layer)
  findOne(@Param('id') id: string) {
    return this.collaboratorsService.findOne(id);
  }

  @Patch(':id')
  // Both managers and employees can update (employees restricted to own profile in service layer)
  update(@Param('id') id: string, @Body() updateCollaboratorDto: UpdateCollaboratorDto) {
    return this.collaboratorsService.update(id, updateCollaboratorDto);
  }

  @Patch(':id/language')
  // Both managers and employees can update language
  updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.collaboratorsService.updateLanguage(id, updateLanguageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('manager')
  remove(@Param('id') id: string) {
    return this.collaboratorsService.remove(id);
  }
}
