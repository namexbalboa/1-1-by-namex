import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MeetingJourney, MeetingJourneySchema } from '../../schemas/meeting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MeetingJourney.name, schema: MeetingJourneySchema }]),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
