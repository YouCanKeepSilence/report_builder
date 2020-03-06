import { HttpModule, Module } from '@nestjs/common';
import { KaitenService } from './kaiten.service';

@Module({
  imports: [HttpModule],
  providers: [KaitenService]
})
export class KaitenModule {}
