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
  } & (T extends 'private' ? IPrivateData : Partial<IPrivateData>)

  interface IPrivateData {
    /**
     * 接收设备号
     */
    device_id: number
  }

  interface IWsResponse<T, U> extends IPrivateData {
    /**
     * 状态码
     */
    status: T
    message: U
  }
  type LoginValidate<T> = { isValidate: boolean; errMsg: T }
}
