import { Controller, Get, Query } from '@nestjs/common';
import { WorklogService } from './worklog.service';

@Controller('worklog')
export class WorklogController {
  constructor(private readonly worklogService: WorklogService) {}

  @Get()
  async getWorklog(@Query() query: any): Promise<object> {
    const {from, to, token} = query;
    return this.worklogService.getWorklog(from, to, token);
  }
}
