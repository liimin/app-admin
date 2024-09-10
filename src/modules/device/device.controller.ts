import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  findAll() {
    return this.deviceService.findAll()
  }

  @Post()
  async create(@Body() param) {
    const newParam = { ...param, status: true }
    await this.deviceService.create(newParam)
    return true
  }

  @Post('/many')
  async createMany(@Body() users) {
    const newUsers = users.map(user => ({ ...user, status: true }))
    await this.deviceService.createMany(newUsers)
    return true
  }
}
