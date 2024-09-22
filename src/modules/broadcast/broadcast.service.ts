import { HttpService } from '@nestjs/axios'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'
@Injectable()
export class BroadcastService {
  constructor(private readonly httpService: HttpService) {}
  // // 广播消息
  onMessage(param: any) :Observable<AxiosResponse<any, any>>{
    return this.httpService.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2f2ba84b-1b7f-4556-8508-e6c605e2671c', {
      msgtype: 'markdown',
      markdown: {
        content: param
      }
    })
  }
}
