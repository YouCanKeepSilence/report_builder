import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorklogModule } from './worklog/worklog.module';
import { IssueModule } from './issue/issue.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KaitenModule } from './kaiten/kaiten.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot({isGlobal: true}),
    WorklogModule, IssueModule, KaitenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
