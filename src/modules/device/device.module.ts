import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { PrismaService } from 'nestjs-prisma';
// import { EventEmitter2 } from '@nestjs/event-emitter';
@Module({
  imports: [],
  controllers: [DeviceController],
  providers: [DeviceService,PrismaService],
})
export class DeviceModule {}
