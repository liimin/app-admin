import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { PrismaService } from 'nestjs-prisma';
import { WsModule } from '../ws/ws.module';
import { WsService } from '../ws/ws.service';
// import { EventEmitter2 } from '@nestjs/event-emitter';
@Module({
  imports: [WsModule],
  controllers: [DeviceController],
  providers: [DeviceService,PrismaService,WsService],
})
export class DeviceModule {}
