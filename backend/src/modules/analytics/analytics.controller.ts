import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('annual-report/:collaboratorId/:year')
  getAnnualReport(@Param('collaboratorId') collaboratorId: string, @Param('year') year: string) {
    return this.analyticsService.getAnnualReport(collaboratorId, parseInt(year));
  }

  @Get('trends/:collaboratorId')
  getTrends(@Param('collaboratorId') collaboratorId: string) {
    return this.analyticsService.getTrends(collaboratorId);
  }

  @Get('team-overview/:managerId')
  getTeamOverview(@Param('managerId') managerId: string) {
    return this.analyticsService.getTeamOverview(managerId);
  }
}
