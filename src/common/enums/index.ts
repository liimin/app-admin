/**
 * @description: 响应码
 */
export enum RESPONSE_CODE {
  NOSUCCESS = -1, // 表示请求成功，但操作未成功
  SUCCESS = 200, // 请求成功
  BAD_REQUEST = 400, // 请求错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 禁止访问
  NOT_FOUND = 404, // 资源未找到
  INTERNAL_SERVER_ERROR = 500 // 服务器错误
}

/**
 * @description: 请求提示语
 */
export enum RESPONSE_MSG {
  SUCCESS = '请求成功',
  FAILURE = '请求失败'
}

export enum WsMessageType {
  /**
   * 私有订阅
   */
  Private = 'private',
  /**
   * 系统订阅
   */
  System = 'system'
}

export enum WsStatus {
  Disuse = 0,
  Online = 1,
  Offline = 2
}

export enum WsAccess {
  NotAllowed = '无访问权限',
  InValidToken = '无效token',
  InvalidDeviceId = '无效设备id',
  IsOnline = '通过验证,设备上线',
  IsOffline = '设备下线',
}

export enum WsConnEvents  {
  Connection='connection',
}
