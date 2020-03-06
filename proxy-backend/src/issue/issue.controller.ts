import { Controller, Get, Param, Headers } from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get('/:id')
  async getIssue(@Param('id') id: string,
                 @Headers('authorization') auth: string): Promise<object> {
    return this.issueService.getIssue(id, auth);
  }
}
