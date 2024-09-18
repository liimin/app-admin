import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
// import { WSResponse } from '../message/model/ws-response.model';
// import { validateToken } from '@/utils/helper';
// import { Message } from '@/entities/message.entity';
// import { User } from '@/entities/user.entity';
import { WsAccess, WsConnEvents, WsMessageType, WsStatus } from '../../common/enums'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class WsService {
  constructor(
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ) {}
  // ws 服务器, gateway 传进来
  server: Server

  // 存储连接的客户端
  clientIds: Map<number, string> = new Map()
  /**
   * 登录
   * @param client socket 客户端
   * @param token token
   * @returns
   */
  login(client: Socket, token: string, deviceId: number): WsTypes.IWsResponse<WsStatus, WsAccess> {
    const clients: Map<string, Socket> = this.server.sockets.sockets
    const clientIsOnline: Socket = clients.get(this.clientIds.get(deviceId))
    // 处理同一工号在多处登录
    clientIsOnline?.emit(WsMessageType.System, `设备 ${deviceId} 已在别处上线, 此客户端下线处理`)
    clientIsOnline?.disconnect()
    // 保存工号
    this.clientIds.set(deviceId, client.id)
    Logger.log(`${deviceId} connected, onLine: ${clients.size}`)
    this.server.emit(WsMessageType.System, `${deviceId} connected, onLine: ${clients.size}`)
    const resData: WsTypes.IWsResponse<WsStatus, WsAccess> = {
      device_id: deviceId,
      status: WsStatus.Online,
      message: WsAccess.IsOnline
    }
    this.emit(resData)
    return resData
  }

  /**
   * 登出
   * @param client client
   */
  async logout({ id }: Socket) {
    // 移除在线 client
    for (let [deviceId, clientId] of this.clientIds) {
      if (clientId === id) {
        this.clientIds.delete(deviceId)
        Logger.log(`${deviceId} disconnected, onLine: ${this.clientIds.size}`)
        this.emit({ device_id: deviceId, status: WsStatus.Offline, message: WsAccess.IsOffline })
        break
      }
    }
  }
  private emit(data: WsTypes.IWsResponse<WsStatus, WsAccess>) {
    const { message, ...rest } = data
    this.eventEmitter.emit(WsConnEvents.Connection, rest)
  }

  /**
   * 重置 connectedClients
   */
  resetClients(): void {
    this.clientIds.clear()
  }

  /**
   * 发送公共消息(系统消息)
   * @param messagePath 发布地址
   * @param response 响应数据
   */
  async sendPublicMessage(payload: WsTypes.MessageBody) {
    console.log('websocket send', payload)
    const res = this.server?.emit(WsMessageType.System, payload.data)
    if (!res) {
      Logger.log('websocket send error', payload)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: `发送失败`, error: 'send error' }, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 发送私人消息(事务消息、个人消息)
   * @param messagePath 发布地址
   * @param response 响应数据
   * @param deviceId 接收者设备号
   */
  async sendPrivateMessage(payload: WsTypes.MessageBody) {
    console.log('websocket send', payload)
    if (!payload.device_id) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: '请求参数employeeId 必传', error: 'deviceId is required' }, HttpStatus.BAD_REQUEST)
    const client = this.server.sockets.sockets.get(this.clientIds.get(payload.device_id))
    const res = client?.emit(WsMessageType.Private, payload.data)
    if (!res) {
      Logger.log('websocket send error', payload)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: `发送失败,客户端:${payload.device_id}不在线`, error: 'send error' }, HttpStatus.BAD_REQUEST)
    }
  }
}
