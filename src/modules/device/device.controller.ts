import { Controller, Get, Post, Body, UseInterceptors, Query, UsePipes, Inject } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
import { AddDeviceDto, AddDeviceInfoDto, DeviceStatusDto } from '../../dto'
import { PagesPipe, ValidationPipe } from '../../common/pipes'
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter'
import { WsAccess, WsConnEvents } from '../../common/enums'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('device')
@Controller('device')
@UseInterceptors(TransformInterceptor)
// @UsePipes(new ValidationPipe({transform: true}))
@UsePipes(new ValidationPipe()) // 使用管道验证
export class DeviceController {
  /**
   * 构造函数，注入DeviceService和EventEmitter2
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  constructor(
    @Inject(DeviceService)
    private readonly deviceService: DeviceService,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * 查找所有设备的方法
   * 该方法接收一个包含查询条件的对象，并返回符合条件的设备列表
   * @param param - 包含查询条件的对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Get()
  @UsePipes(new PagesPipe())
  findAll(@Query() params: DeviceTypes.IQueryDevices): Promise<CommonTypes.IResData> {
    return this.deviceService.findAll(params)
  }

  /**
   * 添加设备的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回添加后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/add')
  addDevice(@Body() param: AddDeviceDto): Promise<CommonTypes.IResponseBase> {
    // console.log(param)
    return this.deviceService.addDevice(param)
  }
  /**
   * 添加设备信息的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回添加后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/addInfo')
  addDeviceInfo(@Body() param: AddDeviceInfoDto): Promise<CommonTypes.IResponseBase> {
    // console.log(param)
    return this.deviceService.addDeviceInfo(param)
  }
  /**
   * 更新设备信息的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回更新后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/updateInfo')
  updateDeviceInfo(@Body() param: AddDeviceInfoDto): Promise<CommonTypes.IResponseBase> {
    return this.deviceService.updateDeviceInfo(param)
  }

  /**
   * 更新设备状态的方法
   * 该方法接收一个包含设备状态的DTO对象，并返回更新后的设备状态
   * @param param - 包含设备状态的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @OnEvent(WsConnEvents.OnConnected)
  @Post('/upsertStatus')
  async upsertDeviceStatus(@Body() param: DeviceStatusDto): Promise<void | CommonTypes.IResponseBase> {
    return await this.deviceService.upsertDeviceStatus(param).catch(error => {
      const out: WsTypes.WsConnError = { message: WsAccess.ConnFailure, device_id: param.device_id }
      this.eventEmitter.emit(WsConnEvents.OnConnectError, out)
    })
  }

  /**
   * 重置所有设备状态的方法
   * 该方法接收一个包含设备状态的DTO对象，并返回更新后的设备状态
   * @param param - 包含设备状态的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/offlineAll')
  @OnEvent(WsConnEvents.OnOfflineAll)
  async resetAllDeviceStatus(): Promise<void | CommonTypes.IResponseBase> {
    return await this.deviceService.resetAllDeviceStatus()
  }
}
