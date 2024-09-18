import { Controller, Get, Post, Body, UseInterceptors, Query, UsePipes } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
import { AddDeviceDto, AddDeviceInfoDto } from '../../dto/device.dto'
import { PagesPipe, ValidationPipe } from '../../common/pipes'
import { OnEvent } from '@nestjs/event-emitter'
import { WsConnEvents } from '../../common/enums'
@Controller('device')
@UseInterceptors(TransformInterceptor)
// @UsePipes(new ValidationPipe({transform: true}))
@UsePipes(new ValidationPipe()) // 使用管道验证
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @UsePipes(new PagesPipe())
  findAll(@Query() params: DeviceTypes.IQueryDevices): Promise<CommonTypes.IResData> {
    return this.deviceService.findAll(params)
  }
  @Post('/add')
  addDevice(@Body() param: AddDeviceDto) {
    // console.log(param)
    return this.deviceService.addDevice(param)
  }
  @Post('/addInfo')
  addDeviceInfo(@Body() param: AddDeviceInfoDto) {
    // console.log(param)
    return this.deviceService.addDeviceInfo(param)
  }
  @OnEvent(WsConnEvents.Connection)
  @Post('/updateInfo')
  updateDeviceInfo(param: AddDeviceInfoDto) {
    return this.deviceService.updateDeviceInfo(param)
  }
}
