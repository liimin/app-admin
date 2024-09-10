import { Module } from '@nestjs/common';
import { DeviceInfoController } from './device-info.controller';
import { DeviceInfoService } from './device-info.service';

@Module({
  imports: [],
  controllers: [DeviceInfoController],
  providers: [DeviceInfoService],
})
export class DeviceInfoModule {}
