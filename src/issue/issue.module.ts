import { HttpModule, Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [HttpModule],
  controllers: [IssueController],
  providers: [IssueService]
})
export class IssueModule {}
