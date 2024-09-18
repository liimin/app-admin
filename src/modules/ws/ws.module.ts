import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  imports: [],
  providers: [WsGateway,WsService],
  exports: [WsGateway],
})
export class WsModule {}
