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
import { SettingsService } from './settings.service';
import { CreateJobRoleDto, UpdateJobRoleDto } from './dto/job-role.dto';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('manager')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ==================== JOB ROLES ====================

  @Post('job-roles')
  @HttpCode(HttpStatus.CREATED)
  createJobRole(@Body() createJobRoleDto: CreateJobRoleDto) {
    return this.settingsService.createJobRole(createJobRoleDto);
  }

  @Get('job-roles')
  findAllJobRoles(@Query('tenantId') tenantId: string) {
    return this.settingsService.findAllJobRoles(tenantId);
  }

  @Get('job-roles/:id')
  findOneJobRole(@Param('id') id: string) {
    return this.settingsService.findOneJobRole(id);
  }

  @Patch('job-roles/:id')
  updateJobRole(@Param('id') id: string, @Body() updateJobRoleDto: UpdateJobRoleDto) {
    return this.settingsService.updateJobRole(id, updateJobRoleDto);
  }

  @Delete('job-roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteJobRole(@Param('id') id: string) {
    return this.settingsService.deleteJobRole(id);
  }

  // ==================== DEPARTMENTS ====================

  @Post('departments')
  @HttpCode(HttpStatus.CREATED)
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.settingsService.createDepartment(createDepartmentDto);
  }

  @Get('departments')
  findAllDepartments(@Query('tenantId') tenantId: string) {
    return this.settingsService.findAllDepartments(tenantId);
  }

  @Get('departments/:id')
  findOneDepartment(@Param('id') id: string) {
    return this.settingsService.findOneDepartment(id);
  }

  @Patch('departments/:id')
  updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.settingsService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete('departments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteDepartment(@Param('id') id: string) {
    return this.settingsService.deleteDepartment(id);
  }
}
