declare module WsTypes {
  abstract class WebSocketGateway<S, T, U> {
    server: S
    abstract subPrivate(data: any): T
    abstract subSystem(data: U): Promise<U>
  }
  type WsMsgType = 'private' | 'system'

  type MessageBody<U, T = WsMsgType> = {
    event: T
    data: U
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
  type MessageData<T, U = CommonTypes.TObj> = {
    order: T | string
    payload: U
  }

  type WsMessageData<T> = MessageData<T>

  type WsConnError = IPrivateData & { message: string }
}
