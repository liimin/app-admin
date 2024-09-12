import { Controller, Get, Post, Body, UseInterceptors, Query, UsePipes } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
import { AddDeviceDto, AddDeviceInfoDto } from './dto/device.dto'
import { PagesPipe, ValidationPipe } from '../../common/pipes'

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
  addDevice(@Body() param: AddDeviceDto){
    // console.log(param)
    return this.deviceService.addDevice(param)
  }
  @Post('/addInfo')
  addDeviceInfo(@Body() param: AddDeviceInfoDto){
    // console.log(param)
    return this.deviceService.addDeviceInfo(param)
  }
  @Post()
  async create(@Body() param) {
    const newParam = { ...param, status: true }
    // await this.deviceService.create(newParam)
    return true
  }

  @Post('/many')
  async createMany(@Body() users) {
    const newUsers = users.map(user => ({ ...user, status: true }))
    // await this.deviceService.createMany(newUsers)
    return true
  }
}
