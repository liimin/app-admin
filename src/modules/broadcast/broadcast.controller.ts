import { Controller, Post, Body, UseInterceptors, UsePipes } from '@nestjs/common'
import { BroadcastService } from './broadcast.service'
import { TransformInterceptor } from '../../common/interceptors'
import { WsGateway } from '../ws/ws.gateway'
import { BroadcastDto } from '../../dto'
import { ValidationPipe } from '../../common/pipes'
@Controller('broadcast')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
export class BroadcastController {
  constructor(
    private readonly broadcastService: BroadcastService,
    private readonly wsGateway: WsGateway
  ) {}

  //写一个message方法 接收params参数 然后调用broadcastService的message方法
  @Post('/message')
  async message(@Body() params: BroadcastDto): Promise<any> {
    return this.wsGateway.send(params)
  }
}
