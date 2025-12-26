import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeetingJourney, MeetingJourneyDocument } from '../../schemas/meeting.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(MeetingJourney.name)
    private meetingJourneyModel: Model<MeetingJourneyDocument>,
  ) {}

  async getAnnualReport(collaboratorId: string, year: number) {
    const journey = await this.meetingJourneyModel
      .findOne({ collaboratorId, year })
      .populate('collaboratorId', 'name email preferredLanguage')
      .populate('managerId', 'name email')
      .exec();

    if (!journey || journey.meetings.length === 0) {
      return {
        collaborator: null,
        year,
        totalMeetings: 0,
        insights: null,
      };
    }

    const meetings = journey.meetings as any[];

    // Calculate averages and trends
    const insights = {
      totalMeetings: meetings.length,

      // Pulse trends
      averagePulse: this.calculateAveragePulse(meetings),
      pulseTrajectory: this.calculatePulseTrajectory(meetings),

      // Block A - Operational
      averageToolAdequacy: this.calculateAverage(meetings, 'blockA.toolAdequacy'),
      averagePriorityClarity: this.calculateAverage(meetings, 'blockA.priorityClarity'),
      commonBlockers: this.getCommonBlockers(meetings),

      // Block B - Strategy
      averageGoalConnection: this.calculateAverage(meetings, 'blockB.goalConnection'),
      averageAutonomy: this.calculateAverage(meetings, 'blockB.autonomy'),
      innovationRate: this.calculateInnovationRate(meetings),

      // Block C - Human Dynamics
      averagePsychologicalSafety: this.calculateAverage(meetings, 'blockC.psychologicalSafety'),
      averageCollaborationFriction: this.calculateAverage(
        meetings,
        'blockC.collaborationFriction',
      ),
      recognitionDistribution: this.getRecognitionDistribution(meetings),

      // Block D - Development
      flowAnalysis: this.analyzeFlow(meetings),
      averageStrengthsUtilization: this.calculateAverage(meetings, 'blockD.strengthsUtilization'),
      topLearningAreas: this.getTopLearningAreas(meetings),
      averageMentalHealth: this.calculateAverage(meetings, 'blockD.mentalHealth'),

      // Action Items
      actionItemsStats: this.getActionItemsStats(meetings),
    };

    return {
      collaborator: journey.collaboratorId,
      manager: journey.managerId,
      year,
      totalMeetings: meetings.length,
      insights,
      meetings: meetings.map((m) => ({
        meetingNumber: m.meetingNumber,
        date: m.date,
      })),
    };
  }

  async getTeamOverview(managerId: string) {
    const journeys = await this.meetingJourneyModel
      .find({ managerId })
      .populate('collaboratorId', 'name email preferredLanguage')
      .exec();

    const teamStats = journeys.map((journey: any) => {
      const meetings = journey.meetings || [];

      return {
        collaborator: journey.collaboratorId,
        year: journey.year,
        totalMeetings: meetings.length,
        lastMeetingDate: meetings.length > 0 ? meetings[meetings.length - 1].date : null,
        averagePulse: this.calculateAveragePulse(meetings),
        averageMentalHealth: this.calculateAverage(meetings, 'blockD.mentalHealth'),
      };
    });

    return {
      manager: managerId,
      totalCollaborators: journeys.length,
      teamStats,
    };
  }

  async getTrends(collaboratorId: string) {
    const journeys = await this.meetingJourneyModel
      .find({ collaboratorId })
      .sort({ year: -1 })
      .limit(3)
      .exec();

    const trends = journeys.map((journey: any) => {
      const meetings = journey.meetings || [];

      return {
        year: journey.year,
        totalMeetings: meetings.length,
        averagePulse: this.calculateAveragePulse(meetings),
        averageMentalHealth: this.calculateAverage(meetings, 'blockD.mentalHealth'),
        averageAutonomy: this.calculateAverage(meetings, 'blockB.autonomy'),
      };
    });

    return {
      collaborator: collaboratorId,
      trends,
    };
  }

  // Helper methods
  private calculateAveragePulse(meetings: any[]): number {
    const pulses = meetings
      .flatMap((m) => m.pulseHistory || [])
      .map((p) => p.value)
      .filter((v) => v !== undefined);

    return pulses.length > 0 ? pulses.reduce((a, b) => a + b, 0) / pulses.length : 0;
  }

  private calculatePulseTrajectory(meetings: any[]): string {
    const pulses = meetings.map((m) => this.calculateAveragePulse([m]));

    if (pulses.length < 2) return 'stable';

    const firstHalf = pulses.slice(0, Math.floor(pulses.length / 2));
    const secondHalf = pulses.slice(Math.floor(pulses.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 0.5) return 'improving';
    if (avgSecond < avgFirst - 0.5) return 'declining';
    return 'stable';
  }

  private calculateAverage(meetings: any[], path: string): number {
    const values = meetings.map((m) => this.getNestedValue(m, path)).filter((v) => v !== undefined);

    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private getCommonBlockers(meetings: any[]): string[] {
    const allTags = meetings
      .flatMap((m) => m.blockA?.blockers?.tags || [])
      .filter((tag) => tag);

    const tagCounts: Record<string, number> = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  }

  private calculateInnovationRate(meetings: any[]): number {
    const innovations = meetings.filter((m) => m.blockB?.innovation === true).length;
    return meetings.length > 0 ? (innovations / meetings.length) * 100 : 0;
  }

  private getRecognitionDistribution(meetings: any[]): Record<string, number> {
    const distribution = { low: 0, medium: 0, high: 0 };

    meetings.forEach((m) => {
      const recognition = m.blockC?.recognition;
      if (recognition && distribution.hasOwnProperty(recognition)) {
        distribution[recognition as keyof typeof distribution]++;
      }
    });

    return distribution;
  }

  private analyzeFlow(meetings: any[]): any {
    const flowData = meetings
      .map((m) => m.blockD?.intellectualChallenge)
      .filter((ic) => ic && ic.skill && ic.challenge);

    if (flowData.length === 0) {
      return { averageSkill: 0, averageChallenge: 0, flowState: 'unknown' };
    }

    const avgSkill = flowData.reduce((sum, ic) => sum + ic.skill, 0) / flowData.length;
    const avgChallenge = flowData.reduce((sum, ic) => sum + ic.challenge, 0) / flowData.length;

    let flowState = 'unknown';
    if (avgSkill > 7 && avgChallenge > 7) flowState = 'flow';
    else if (avgSkill < 5 && avgChallenge > 7) flowState = 'anxiety';
    else if (avgSkill > 7 && avgChallenge < 5) flowState = 'boredom';
    else if (avgSkill < 5 && avgChallenge < 5) flowState = 'apathy';

    return { averageSkill: avgSkill, averageChallenge: avgChallenge, flowState };
  }

  private getTopLearningAreas(meetings: any[]): string[] {
    const allAreas = meetings
      .flatMap((m) => m.blockD?.activeLearning || [])
      .filter((area) => area);

    const areaCounts: Record<string, number> = {};
    allAreas.forEach((area) => {
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });

    return Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area]) => area);
  }

  private getActionItemsStats(meetings: any[]): any {
    const allItems = meetings.flatMap((m) => m.actionItems || []);

    return {
      total: allItems.length,
      done: allItems.filter((i) => i.status === 'done').length,
      pending: allItems.filter((i) => i.status === 'pending').length,
      blocked: allItems.filter((i) => i.status === 'blocked').length,
      completionRate:
        allItems.length > 0
          ? (allItems.filter((i) => i.status === 'done').length / allItems.length) * 100
          : 0,
    };
  }
}
