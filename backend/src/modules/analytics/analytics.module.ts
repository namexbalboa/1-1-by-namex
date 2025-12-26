import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MeetingJourney, MeetingJourneySchema } from '../../schemas/meeting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MeetingJourney.name, schema: MeetingJourneySchema }]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
