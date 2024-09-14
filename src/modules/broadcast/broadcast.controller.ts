import { Controller,Post,Body ,UseInterceptors} from '@nestjs/common'
import { BroadcastService } from './broadcast.service'
import { TransformInterceptor } from '../../common/interceptors'

@Controller('broadcast')
@UseInterceptors(TransformInterceptor)
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService){}
  //写一个message方法 接收params参数 然后调用broadcastService的message方法
  @Post('message')
  message(@Body() params:any){
    // return this.broadcastService.message(params)
  }
}
