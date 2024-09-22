import { Module } from '@nestjs/common'
import { BroadcastController } from './broadcast.controller'
import { BroadcastService } from './broadcast.service'
import { WsModule } from '../ws/ws.module';
import { WsService } from '../ws/ws.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [WsModule,HttpModule],
  controllers: [BroadcastController],
  providers: [BroadcastService,WsService]
})
export class BroadcastModule {}
