declare module WsTypes {
  abstract class WebSocketGateway<S, T, U> {
    server: S
    abstract subPrivate(data: any): T
    abstract subSystem(data: U): Promise<U>
  }
  type WsMsgType = 'private' | 'system'

  type MessageBody<T = WsMsgType> = {
    event: T
    data: any
  } & (T extends 'private' ? PrivateData : Partial<PrivateData>)

  interface PrivateData {
    /**
     * 接收者工号
     */
    employeeId: string
  }
}
