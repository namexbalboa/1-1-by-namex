import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MeetingJourney, MeetingJourneySchema } from '../../schemas/meeting.schema';
import { Collaborator, CollaboratorSchema } from '../../schemas/collaborator.schema';
import { Department, DepartmentSchema } from '../../schemas/department.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MeetingJourney.name, schema: MeetingJourneySchema },
      { name: Collaborator.name, schema: CollaboratorSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    EmailModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
