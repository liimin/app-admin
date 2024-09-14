import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
// import { WSResponse } from '../message/model/ws-response.model';
// import { validateToken } from '@/utils/helper';
// import { Message } from '@/entities/message.entity';
// import { User } from '@/entities/user.entity';

@Injectable()
export class WsService {
  constructor() {}
  // ws 服务器, gateway 传进来
  server: Server

  // 存储连接的客户端
  clientIds: Map<string, string> = new Map()
  /**
   * 登录
   * @param client socket 客户端
   * @param token token
   * @returns
   */
  async login(client: Socket, token: string): Promise<void> {
    if (!token) {
      Logger.error('token error: ', token)
      client.send('token error')
      client.disconnect() // T下线
      return
    }
    // 认证用户
    const res = { employeeId: 1 + '' } //JwtInterface = validateToken(token.replace('Bearer ', ''))
    if (!res) {
      Logger.error('token 验证不通过')
      client.send('token 验证不通过')
      client.disconnect()
      return
    }
    const employeeId: string = res?.employeeId
    if (!employeeId) {
      Logger.log('token error')
      client.send('token error')
      client.disconnect()
      return
    }
    const clients: Map<string, Socket> = this.server.sockets.sockets
    const clientIsOnline: Socket = clients.get(this.clientIds.get(employeeId))
    // 处理同一工号在多处登录
    clientIsOnline?.send(`${employeeId} 已在别处上线, 此客户端下线处理`)
    clientIsOnline?.disconnect()
    // 保存工号
    this.clientIds.set(employeeId, client.id)
    Logger.log(`${employeeId} connected, onLine: ${clients.size}`)
    this.server.send(`${employeeId} connected, onLine: ${clients.size}`)
    return
  }

  /**
   * 登出
   * @param client client
   */
  async logout({ id }: Socket) {
    // 移除在线 client
    this.clientIds.forEach((clientId: string, employeeId: string) => {
      if (clientId === id) {
        this.clientIds.delete(employeeId)
        Logger.log(`${employeeId} disconnected, onLine: ${this.clientIds.size}`)
      }
    })
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
  async sendPublicMessage(data: WsTypes.SystemData) {
    const res = this.server?.emit(WsTypes.MessageType.System, data)
    if (!res) {
      Logger.log('websocket send error', data)
    }
  }

  /**
   * 发送私人消息(事务消息、个人消息)
   * @param messagePath 发布地址
   * @param response 响应数据
   * @param employeeId 接收者工号
   */
  async sendPrivateMessage(data: WsTypes.PrivateData) {
    const client = this.server.sockets.sockets.get(this.clientIds.get(data.employeeId))
    const res = client?.emit(WsTypes.MessageType.Private, data)
    if (!res) {
      Logger.log('websocket send error', data)
    }
  }

  send(payload: WsTypes.SendBody<WsTypes.MessageType>) {
    if (payload.event === WsTypes.MessageType.Private) {
      this.sendPrivateMessage(payload.data as WsTypes.PrivateData)
    } else {
      this.sendPublicMessage(payload.data)
    }
  }
}
