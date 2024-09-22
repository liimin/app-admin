import { Controller, Post, Body, UseInterceptors, UsePipes, Logger } from '@nestjs/common'
import { BroadcastService } from './broadcast.service'
import { TransformInterceptor } from '../../common/interceptors'
import { WsGateway } from '../ws/ws.gateway'
import { BroadcastDto } from '../../dto'
import { ValidationPipe } from '../../common/pipes'
import { ApiTags } from '@nestjs/swagger'
import { OnEvent } from '@nestjs/event-emitter'
import { WsConnEvents } from '../../common/enums'
@ApiTags('broadcast')
@Controller('broadcast')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
export class BroadcastController {
  /**
   * @param wsGateway - WsGateway实例
   */
  constructor(private readonly wsGateway: WsGateway,
    private readonly broadcastService: BroadcastService
  ) {}

  /**
   * 发送广播消息
   * @param params - 包含广播消息的对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/cmd')
  async message(@Body() params: BroadcastDto): Promise<CommonTypes.IResData> {
    return this.wsGateway.send(params)
  }
  @OnEvent(WsConnEvents.OnMessage)
  onMessage(@Body() params: any){
    Logger.debug('收到私有订阅消息：', params)
    this.broadcastService.onMessage(params)
  }
}
