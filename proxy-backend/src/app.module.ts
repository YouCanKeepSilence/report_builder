import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorklogModule } from './worklog/worklog.module';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [WorklogModule, IssueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
