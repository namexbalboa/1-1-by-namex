import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeetingJourney, MeetingJourneyDocument } from '../../schemas/meeting.schema';
import { Collaborator, CollaboratorDocument } from '../../schemas/collaborator.schema';
import { Department, DepartmentDocument } from '../../schemas/department.schema';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { ScheduleMeetingDto } from './dto/schedule-meeting.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(MeetingJourney.name)
    private meetingJourneyModel: Model<MeetingJourneyDocument>,
    @InjectModel(Collaborator.name)
    private collaboratorModel: Model<CollaboratorDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    private readonly emailService: EmailService,
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

    // If marking as completed, set completedAt timestamp
    if (updateMeetingDto.status === 'completed') {
      (journey.meetings[meetingIndex] as any).completedAt = new Date();
    }

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

  async scheduleMeeting(scheduleMeetingDto: ScheduleMeetingDto): Promise<any> {
    const { tenantId, collaboratorId, managerId, date, time } = scheduleMeetingDto;

    // Get collaborator details with department
    const collaborator = await this.collaboratorModel
      .findById(collaboratorId)
      .populate('departmentId')
      .populate('managerId', 'name email')
      .exec();

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    // Parse date and time
    const meetingDateTime = new Date(`${date}T${time}:00`);
    const year = meetingDateTime.getFullYear();

    // Find or create journey for this year
    let journey = await this.meetingJourneyModel.findOne({
      collaboratorId,
      year,
    });

    if (!journey) {
      journey = new this.meetingJourneyModel({
        tenantId,
        collaboratorId,
        managerId,
        year,
        meetings: [],
      });
    }

    // Calculate next meeting number
    const meetingNumber = journey.meetings.length + 1;

    // Add meeting to journey
    journey.meetings.push({
      meetingNumber,
      date: meetingDateTime,
      actionItems: [],
      pulseHistory: [],
    } as any);

    await journey.save();

    // Send confirmation email
    this.emailService
      .sendMeetingConfirmationEmail(
        collaborator.name,
        collaborator.email,
        meetingDateTime,
        collaborator.preferredLanguage,
      )
      .then((result) => {
        if (!result.success) {
          console.error(`Failed to send meeting confirmation email to ${collaborator.email}:`, result.error);
        }
      })
      .catch((error) => {
        console.error('Unexpected error sending meeting confirmation email:', error);
      });

    return {
      journey: {
        id: journey._id,
        year: journey.year,
      },
      meeting: {
        meetingNumber,
        date: meetingDateTime,
        time,
      },
      collaborator: {
        id: collaborator._id,
        name: collaborator.name,
        email: collaborator.email,
        department: collaborator.departmentId,
      },
    };
  }

  async getAllScheduledMeetings(tenantId: string): Promise<any[]> {
    const journeys = await this.meetingJourneyModel
      .find({ tenantId })
      .populate('collaboratorId', 'name email')
      .populate({
        path: 'collaboratorId',
        populate: {
          path: 'departmentId',
          select: 'name',
        },
      })
      .exec();

    const scheduledMeetings = [];

    for (const journey of journeys) {
      for (const meeting of journey.meetings) {
        // Only include scheduled meetings (not completed or cancelled)
        if ((meeting as any).status !== 'completed' && (meeting as any).status !== 'cancelled') {
          const collaborator = journey.collaboratorId as any;
          scheduledMeetings.push({
            id: `${journey._id}-${meeting.meetingNumber}`,
            collaboratorName: collaborator.name,
            collaboratorId: collaborator._id,
            department: collaborator.departmentId?.name || 'N/A',
            date: meeting.date,
            time: new Date(meeting.date).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            meetingNumber: meeting.meetingNumber,
            journeyId: journey._id,
            status: (meeting as any).status || 'scheduled',
          });
        }
      }
    }

    return scheduledMeetings;
  }

  async getUpcomingMeetings(tenantId: string, limit: number = 5): Promise<any[]> {
    const now = new Date();

    const journeys = await this.meetingJourneyModel
      .find({ tenantId })
      .populate('collaboratorId', 'name email')
      .populate({
        path: 'collaboratorId',
        populate: {
          path: 'departmentId',
          select: 'name',
        },
      })
      .exec();

    const upcomingMeetings = [];

    for (const journey of journeys) {
      for (const meeting of journey.meetings) {
        const meetingDate = new Date(meeting.date);

        // Only include future meetings that are not completed or cancelled
        if (meetingDate >= now && (meeting as any).status !== 'completed' && (meeting as any).status !== 'cancelled') {
          const collaborator = journey.collaboratorId as any;
          upcomingMeetings.push({
            _id: `${journey._id}-${meeting.meetingNumber}`,
            collaborator: {
              name: collaborator.name,
              email: collaborator.email,
              department: {
                name: collaborator.departmentId?.name || 'N/A',
              },
            },
            scheduledDate: meeting.date,
            meetingNumber: meeting.meetingNumber,
            journeyId: journey._id,
          });
        }
      }
    }

    // Sort by date (earliest first) and limit
    upcomingMeetings.sort((a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );

    return upcomingMeetings.slice(0, limit);
  }

  async getDashboardStatistics(
    tenantId: string,
    collaboratorId?: string,
    isManager: boolean = false,
  ): Promise<any> {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (isManager) {
      // Manager statistics - across all their team
      const journeys = await this.meetingJourneyModel
        .find({ tenantId, year: currentYear })
        .populate('collaboratorId', 'name')
        .exec();

      let completedMeetings = 0;
      let totalSatisfactionScore = 0;
      let satisfactionCount = 0;
      let pendingActionItems = 0;
      const uniqueCollaborators = new Set();

      for (const journey of journeys) {
        uniqueCollaborators.add(journey.collaboratorId._id.toString());

        for (const meeting of journey.meetings) {
          // Count completed meetings (status = completed)
          const meetingStatus = (meeting as any).status || 'scheduled';
          if (meetingStatus === 'completed') {
            completedMeetings++;

            // Calculate satisfaction from climate (blockC.psychologicalSafety) and mental health (blockD.mentalHealth)
            const climateScore = (meeting as any).blockC?.psychologicalSafety || 0;
            const mentalHealthScore = (meeting as any).blockD?.mentalHealth || 0;

            if (climateScore > 0) {
              totalSatisfactionScore += climateScore * 2; // Scale from 1-5 to 1-10
              satisfactionCount++;
            }
            if (mentalHealthScore > 0) {
              totalSatisfactionScore += mentalHealthScore * 2; // Scale from 1-5 to 1-10
              satisfactionCount++;
            }
          }

          // Count pending action items
          if ((meeting as any).actionItems) {
            (meeting as any).actionItems.forEach((item: any) => {
              if (item.status !== 'done') {
                pendingActionItems++;
              }
            });
          }
        }
      }

      const averageSatisfaction = satisfactionCount > 0
        ? Math.round((totalSatisfactionScore / satisfactionCount) * 10) / 10
        : 0;

      return {
        completedMeetings,
        averageSatisfaction,
        pendingActionItems,
        totalCollaborators: uniqueCollaborators.size,
      };
    } else {
      // Employee statistics - only their own meetings
      const journey = await this.meetingJourneyModel
        .findOne({ tenantId, collaboratorId, year: currentYear })
        .exec();

      if (!journey) {
        return {
          completedMeetings: 0,
          averageSatisfaction: 0,
          pendingActionItems: 0,
        };
      }

      let completedMeetings = 0;
      let totalSatisfactionScore = 0;
      let satisfactionCount = 0;
      let pendingActionItems = 0;

      for (const meeting of journey.meetings) {
        const meetingStatus = (meeting as any).status || 'scheduled';
        if (meetingStatus === 'completed') {
          completedMeetings++;

          const climateScore = (meeting as any).blockC?.psychologicalSafety || 0;
          const mentalHealthScore = (meeting as any).blockD?.mentalHealth || 0;

          if (climateScore > 0) {
            totalSatisfactionScore += climateScore * 2; // Scale from 1-5 to 1-10
            satisfactionCount++;
          }
          if (mentalHealthScore > 0) {
            totalSatisfactionScore += mentalHealthScore * 2; // Scale from 1-5 to 1-10
            satisfactionCount++;
          }
        }

        if ((meeting as any).actionItems) {
          (meeting as any).actionItems.forEach((item: any) => {
            if (item.status !== 'done') {
              pendingActionItems++;
            }
          });
        }
      }

      const averageSatisfaction = satisfactionCount > 0
        ? Math.round((totalSatisfactionScore / satisfactionCount) * 10) / 10
        : 0;

      return {
        completedMeetings,
        averageSatisfaction,
        pendingActionItems,
      };
    }
  }

  async getHistory(tenantId: string, year: number): Promise<any[]> {
    const now = new Date();

    // Get all journeys for the specified year
    const journeys = await this.meetingJourneyModel
      .find({ tenantId, year })
      .populate('collaboratorId', 'name email')
      .populate('managerId', 'name')
      .populate({
        path: 'collaboratorId',
        populate: {
          path: 'departmentId',
          select: 'name',
        },
      })
      .exec();

    const historyData = [];

    for (const journey of journeys) {
      const collaborator = journey.collaboratorId as any;
      const manager = journey.managerId as any;

      let completedMeetings = 0;
      let totalSatisfactionScore = 0;
      let satisfactionCount = 0;
      let pendingActionItems = 0;
      let scheduledMeetings = 0;
      let lastMeetingDate: Date | null = null;
      let nextMeetingDate: Date | null = null;

      // Process all meetings
      for (const meeting of journey.meetings) {
        const meetingDate = new Date(meeting.date);
        const meetingStatus = (meeting as any).status || 'scheduled';

        // Count scheduled meetings for attendance rate (only scheduled ones)
        if (meetingStatus === 'scheduled' || meetingStatus === 'completed') {
          scheduledMeetings++;
        }

        // Count completed meetings (status = completed)
        if (meetingStatus === 'completed') {
          completedMeetings++;

          // Update last meeting date
          if (!lastMeetingDate || meetingDate > lastMeetingDate) {
            lastMeetingDate = meetingDate;
          }

          // Calculate satisfaction from climate (blockC.psychologicalSafety) and mental health (blockD.mentalHealth)
          const climateScore = (meeting as any).blockC?.psychologicalSafety || 0;
          const mentalHealthScore = (meeting as any).blockD?.mentalHealth || 0;

          if (climateScore > 0) {
            totalSatisfactionScore += climateScore * 2; // Scale from 1-5 to 1-10
            satisfactionCount++;
          }
          if (mentalHealthScore > 0) {
            totalSatisfactionScore += mentalHealthScore * 2; // Scale from 1-5 to 1-10
            satisfactionCount++;
          }
        }

        // Find next meeting (future date, earliest, not completed)
        if (meetingDate >= now && meetingStatus !== 'completed' && meetingStatus !== 'cancelled') {
          if (!nextMeetingDate || meetingDate < nextMeetingDate) {
            nextMeetingDate = meetingDate;
          }
        }

        // Count pending action items
        if ((meeting as any).actionItems) {
          (meeting as any).actionItems.forEach((item: any) => {
            if (item.status !== 'done') {
              pendingActionItems++;
            }
          });
        }
      }

      const averageSatisfaction = satisfactionCount > 0
        ? Math.round((totalSatisfactionScore / satisfactionCount) * 10) / 10
        : 0;

      const attendanceRate = scheduledMeetings > 0
        ? Math.round((completedMeetings / scheduledMeetings) * 100)
        : 0;

      historyData.push({
        collaboratorId: collaborator._id,
        collaboratorName: collaborator.name,
        department: collaborator.departmentId?.name || 'N/A',
        currentManager: manager?.name || 'N/A',
        metrics: {
          completedMeetings,
          averageSatisfaction,
          pendingActionItems,
          attendanceRate,
        },
        lastMeeting: lastMeetingDate,
        nextMeeting: nextMeetingDate,
      });
    }

    // Sort by collaborator name
    historyData.sort((a, b) => a.collaboratorName.localeCompare(b.collaboratorName));

    return historyData;
  }
}
