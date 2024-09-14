import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { WsGateway } from '../ws/ws.gateway';
@Injectable()
export class BroadcastService {
    constructor(private readonly wsGateway: WsGateway) { }
    // 广播消息
    message() {
        this.wsGateway.server.emit('message', 'hello world')
    }
}
