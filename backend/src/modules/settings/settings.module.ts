import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { JobRole, JobRoleSchema } from '../../schemas/job-role.schema';
import { Department, DepartmentSchema } from '../../schemas/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobRole.name, schema: JobRoleSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
