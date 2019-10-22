import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorklogModule } from './worklog/worklog.module';

@Module({
  imports: [WorklogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
