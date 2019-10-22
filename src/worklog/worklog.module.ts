import { HttpModule, Module } from '@nestjs/common';
import { WorklogController } from './worklog.controller';
import { WorklogService } from './worklog.service';

@Module({
  imports: [HttpModule],
  controllers: [WorklogController],
  providers: [WorklogService]
})
export class WorklogModule {}
