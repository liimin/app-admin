import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { ConfigService } from 'nestjs-config'
import { Command, Events, FileCommand, RESPONSE_CODE } from '../../common/enums'
import { EventEmitter2 } from '@nestjs/event-emitter'
@Injectable()
export class BroadcastService {
  private webHook: string
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2
  ) {
    this.webHook = this.config.get('env').AppWebhook
  }
  // // 广播消息
  async onMessage(param: any): Promise<CommonTypes.IResData> {
    if (param?.code === RESPONSE_CODE.SUCCESS && param?.data?.command === Command.File && param?.data?.payload?.command === FileCommand.Remove) {
      this.eventEmitter.emit(Events.OnLogFileRemoved, { device_id: param.device_id, last_log_remove_time: new Date() })
      return
    }
    const res: AxiosResponse<any, any> = await this.httpService
      .post(this.webHook, {
        msgtype: 'text',
        text: {
          content: JSON.stringify(param)
        }
      })
      .toPromise()
    return { code: res.status, message: '发送企微消息成功' }
  }
}
