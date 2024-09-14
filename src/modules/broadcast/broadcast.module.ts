import { Module } from '@nestjs/common'
import { BroadcastController } from './broadcast.controller'
import { BroadcastService } from './broadcast.service'
import { WsModule } from '../ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [BroadcastController],
  providers: [BroadcastService]
})
export class BroadcastModule {}
