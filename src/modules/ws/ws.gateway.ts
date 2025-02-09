import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { WsService } from './ws.service'
import { Logger, Module, UseInterceptors } from '@nestjs/common'
import { WsMessageType, WsStatus, WsAccess, Command } from '../../common/enums'
import { TransformInterceptor } from '../../common/interceptors'

/**
 * WebSocket 网关
 *
 * @implements WsTypes.WebSocketGateway<Server,WsResponse<string>,any>
 * @implements OnGatewayConnection
 * @implements OnGatewayDisconnect
 * @implements OnGatewayInit
 */
@WebSocketGateway(+process.env.SOCKET_PORT, {
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
    this.wsService.onMessage(data)
    return from<string>('ok').pipe(map(item => ({ event: WsMessageType.Private, data: item })))
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
  handleConnection(client: Socket, ...args: any[]): WsTypes.IWsResponse<WsStatus, WsAccess> {
    const auth = client.handshake?.auth ?? client.handshake?.headers
    const ValidateData: WsTypes.LoginValidate<WsAccess> = { isValidate: true, errMsg: WsAccess.IsOnline }
    if (!auth) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.NotAllowed
    }
    const { token, deviceId } = auth
    // 注册用户
    if (!token) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.InValidToken
    }
    if (!deviceId) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.InvalidDeviceId
    }
    if (!ValidateData.isValidate) {
      const msg = `${ValidateData.errMsg} token->${token} deviceId->${deviceId}}`
      client.emit(WsMessageType.Private, msg)
      Logger.error(msg)
      const resData: WsTypes.IWsResponse<WsStatus, WsAccess> = {
        status: WsStatus.Offline,
        message: ValidateData.errMsg,
        device_id: deviceId
      }
      client.disconnect()
      return resData
    }
    return this.wsService.login(client, token, deviceId)
  }

  /**
   * 用户断开连接
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
    Logger.debug('Websocket init... Port: ' + process.env.SOCKET_PORT)
    this.wsService.server = server
    // 重置 socketIds
    this.wsService.resetClients()
  }

  /**
   * 发送消息
   * @param payload
   */
  public send(payload: WsTypes.MessageBody<WsTypes.WsMessageData<Command>, WsMessageType>): Promise<CommonTypes.IResData> {
    return this.wsService[{ [WsMessageType.Private]: 'sendPrivateMessage', [WsMessageType.System]: 'sendPublicMessage' }[payload.event]](payload)
  }
}
