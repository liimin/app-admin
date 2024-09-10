import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceInfoService } from './device-info.service';

@ApiBearerAuth()
@ApiTags('device-info')
@Controller('/device-info')
export class DeviceInfoController {
  constructor(private readonly deviceInfoService: DeviceInfoService) {}

  // 查询
  @Get()
  fetch(@Query() { id }): string {
    return this.deviceInfoService.fetch(id);
  }
}
