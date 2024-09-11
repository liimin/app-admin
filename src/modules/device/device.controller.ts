import { Controller, Get, Post, Body, UseInterceptors, Query } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
import { ResponseDto } from 'src/dto/response.dto'
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  findAll(@Query() { user,mobile,sn,pageindex,pageSize }:Api.Device.QueryDevice):Promise<ResponseDto> {
    return this.deviceService.findAll({user,mobile,sn,pageindex,pageSize})
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
