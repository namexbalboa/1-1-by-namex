import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // Journey endpoints
  @Post('journeys')
  @HttpCode(HttpStatus.CREATED)
  createJourney(@Body() createJourneyDto: CreateJourneyDto) {
    return this.meetingsService.createJourney(createJourneyDto);
  }

  @Get('journeys/:collaboratorId/:year')
  findJourneyByCollaboratorAndYear(
    @Param('collaboratorId') collaboratorId: string,
    @Param('year') year: string,
  ) {
    return this.meetingsService.findJourneyByCollaboratorAndYear(
      collaboratorId,
      parseInt(year),
    );
  }

  @Get('journeys/manager/:managerId')
  findJourneysByManager(@Param('managerId') managerId: string) {
    return this.meetingsService.findJourneysByManager(managerId);
  }

  @Get('journeys/collaborator/:collaboratorId')
  findJourneysByCollaborator(@Param('collaboratorId') collaboratorId: string) {
    return this.meetingsService.findJourneysByCollaborator(collaboratorId);
  }

  // Meeting endpoints
  @Post('journeys/:journeyId/meetings')
  @HttpCode(HttpStatus.CREATED)
  addMeeting(@Param('journeyId') journeyId: string, @Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.addMeeting(journeyId, createMeetingDto);
  }

  @Get('journeys/:journeyId/meetings/:meetingNumber')
  getMeeting(@Param('journeyId') journeyId: string, @Param('meetingNumber') meetingNumber: string) {
    return this.meetingsService.getMeeting(journeyId, parseInt(meetingNumber));
  }

  @Patch('journeys/:journeyId/meetings/:meetingNumber')
  updateMeeting(
    @Param('journeyId') journeyId: string,
    @Param('meetingNumber') meetingNumber: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    return this.meetingsService.updateMeeting(journeyId, parseInt(meetingNumber), updateMeetingDto);
  }

  @Delete('journeys/:journeyId/meetings/:meetingNumber')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMeeting(
    @Param('journeyId') journeyId: string,
    @Param('meetingNumber') meetingNumber: string,
  ) {
    return this.meetingsService.deleteMeeting(journeyId, parseInt(meetingNumber));
  }
}
