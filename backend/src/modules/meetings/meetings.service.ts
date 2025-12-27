import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeetingJourney, MeetingJourneyDocument } from '../../schemas/meeting.schema';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(MeetingJourney.name)
    private meetingJourneyModel: Model<MeetingJourneyDocument>,
  ) {}

  async createJourney(createJourneyDto: CreateJourneyDto): Promise<MeetingJourney> {
    // Check if journey already exists for this collaborator/year
    const existingJourney = await this.meetingJourneyModel.findOne({
      collaboratorId: createJourneyDto.collaboratorId,
      year: createJourneyDto.year,
    });

    if (existingJourney) {
      throw new ConflictException(
        'Journey already exists for this collaborator and year',
      );
    }

    const journey = new this.meetingJourneyModel(createJourneyDto);
    return journey.save();
  }

  async findJourneyByCollaboratorAndYear(
    collaboratorId: string,
    year: number,
  ): Promise<MeetingJourney> {
    const journey = await this.meetingJourneyModel
      .findOne({ collaboratorId, year })
      .populate('tenantId', 'name logo')
      .populate('collaboratorId', 'name email preferredLanguage')
      .populate('managerId', 'name email')
      .exec();

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    return journey;
  }

  async findJourneysByManager(managerId: string): Promise<MeetingJourney[]> {
    return this.meetingJourneyModel
      .find({ managerId })
      .populate('collaboratorId', 'name email preferredLanguage')
      .exec();
  }

  async findJourneysByCollaborator(collaboratorId: string): Promise<MeetingJourney[]> {
    return this.meetingJourneyModel
      .find({ collaboratorId })
      .populate('tenantId', 'name logo')
      .populate('managerId', 'name email')
      .sort({ year: -1 })
      .exec();
  }

  async addMeeting(
    journeyId: string,
    createMeetingDto: CreateMeetingDto,
  ): Promise<MeetingJourney> {
    const journey = await this.meetingJourneyModel.findById(journeyId);

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    // Check if meeting number already exists
    const meetingExists = journey.meetings.some(
      (m: any) => m.meetingNumber === createMeetingDto.meetingNumber,
    );

    if (meetingExists) {
      throw new ConflictException('Meeting with this number already exists in the journey');
    }

    journey.meetings.push(createMeetingDto as any);
    return journey.save();
  }

  async updateMeeting(
    journeyId: string,
    meetingNumber: number,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<MeetingJourney> {
    const journey = await this.meetingJourneyModel.findById(journeyId);

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    const meetingIndex = journey.meetings.findIndex(
      (m: any) => m.meetingNumber === meetingNumber,
    );

    if (meetingIndex === -1) {
      throw new NotFoundException('Meeting not found');
    }

    // Update the meeting
    Object.assign(journey.meetings[meetingIndex], updateMeetingDto);

    return journey.save();
  }

  async getMeeting(journeyId: string, meetingNumber: number): Promise<any> {
    const journey = await this.meetingJourneyModel
      .findById(journeyId)
      .populate('collaboratorId', 'name email preferredLanguage')
      .exec();

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    const meeting = journey.meetings.find((m: any) => m.meetingNumber === meetingNumber);

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return {
      journey: {
        id: journey._id,
        year: journey.year,
        collaborator: journey.collaboratorId,
      },
      meeting,
    };
  }

  async deleteMeeting(journeyId: string, meetingNumber: number): Promise<MeetingJourney> {
    const journey = await this.meetingJourneyModel.findById(journeyId);

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    const meetingIndex = journey.meetings.findIndex(
      (m: any) => m.meetingNumber === meetingNumber,
    );

    if (meetingIndex === -1) {
      throw new NotFoundException('Meeting not found');
    }

    journey.meetings.splice(meetingIndex, 1);
    return journey.save();
  }
}
