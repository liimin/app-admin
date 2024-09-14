declare namespace WsTypes {
  abstract class WebSocketGateway<S, T, U> {
    server: S
    abstract subPrivate(data: any): T
    abstract subSystem(data: U): Promise<U>
  }

  enum MessageType {
    /**
     * 私有订阅
     */
    Private = 'private',
    /**
     * 系统订阅
     */
    System = 'system'
  }
  interface SystemData {
    [key: string]: any
  }

  interface PrivateData extends SystemData {
    /**
     * 接收者工号
     */
    employeeId: string
  }
  interface MessageDataMap {
    [MessageType.Private]: PrivateData
    [MessageType.System]: SystemData
  }

  type ConditionalData<T extends MessageType> = T extends MessageType ? MessageDataMap[T] : never

  // 最后，修改SendBody接口，使用ConditionalData来约束T
  interface SendBody<T extends MessageType> {
    event: T
    data: ConditionalData<T>
  }
}
