import { Module } from '@nestjs/common'
import { BroadcastController } from './broadcast.controller'
import { BroadcastService } from './broadcast.service'
import { WsModule } from '../ws/ws.module';
import { WsService } from '../ws/ws.service';
@Module({
  imports: [WsModule],
  controllers: [BroadcastController],
  providers: [BroadcastService,WsService]
})
export class BroadcastModule {}
