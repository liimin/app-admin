import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { WsService } from './ws.service'
import { Logger, Module, UseInterceptors } from '@nestjs/common'
import { WsMessageType } from '../../common/enums'
import { TransformInterceptor } from '../..//common/interceptors'

/**
 * WebSocket 网关
 *
 * @implements WsTypes.WebSocketGateway<Server,WsResponse<string>,any>
 * @implements OnGatewayConnection
 * @implements OnGatewayDisconnect
 * @implements OnGatewayInit
 */
@WebSocketGateway(8080, {
  origin: '*', // 允许任何来源
  methods: ['GET', 'POST'], // 允许的 HTTP 请求类型
  cors: true // 允许跨域
})
@UseInterceptors(TransformInterceptor)
export class WsGateway implements WsTypes.WebSocketGateway<Server, Observable<WsResponse<string>>, any>, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  /**
   * 用于初始化私有订阅消息处理类的构造函数。
   *
   * @param wsService - 注入的 WebSocket 服务实例，用于处理 WebSocket 相关操作。
   */
  constructor(public readonly wsService: WsService) {}
  /**
   * WebSocket 服务器实例
   */
  @WebSocketServer()
  server: Server
  /**
   * 处理私有订阅消息
   * @param data - 传入的数据
   * @returns 包含事件和数据的 Observable 对象
   */
  @SubscribeMessage(WsMessageType.Private)
  subPrivate(@MessageBody() data: any): Observable<WsResponse<string>> {
    return from<string>('hello').pipe(map(item => ({ event: 'events', data: item })))
  }

  /**
   * 处理系统订阅消息
   * @param data - 传入的数据
   * @returns 包含事件和数据的 Observable 对象
   */
  @SubscribeMessage(WsMessageType.System)
  async subSystem(@MessageBody() data: number): Promise<number> {
    return data
  }
  /**
   * 用户连接上
   * @param client client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    console.log('用户连接上', client.id)
    // 注册用户
    const token = client.handshake?.auth?.token ?? client.handshake?.headers?.authorization
    return this.wsService.login(client, token)
  }

  /**
   * 用户断开
   * @param client client
   */
  handleDisconnect(client: Socket) {
    // 移除数据 socketID
    this.wsService.logout(client)
  }

  /**
   * 初始化
   * @param server
   */
  afterInit(server: Server) {
    Logger.log('websocket init... port: ' + process.env.PORT)
    this.wsService.server = server
    // 重置 socketIds
    this.wsService.resetClients()
  }

  public send(payload:WsTypes.MessageBody):Promise<any> {
    if (payload.event === WsMessageType.Private) {
      return this.wsService.sendPrivateMessage(payload)
    } else {
      return this.wsService.sendPublicMessage(payload)
    }
  }
}
