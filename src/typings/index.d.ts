declare namespace Api {
  namespace Common {
    /**
     * @description: 全局响应体
     */
    type Response<T = any> = {
      code: number // 状态码
      data?: T // 业务数据
      msg: string // 响应信息
      timestamp: number // 时间戳
    }
    /**
     * @description: 分页数据
     */
    type PageResponse<T = any> = {
      current?: number // 页码
      size?: number // 当前页条数
      total?: number // 总条数
      records: T[] // 业务数据
    }
  }
  namespace Device {

    type QueryDevice = {
      user?: string // 用户
      mobile?: string // 手机号
      sn?: string // 设备号
      pageindex?: number // 页码
      pageSize?: number // 每页条数
    }
    type DeviceInfo = {
      id?: string // 设备id
      user?: string // 用户
      mobile?: string // 手机号
      sn?: string // 设备号
      status?: number // 状态
      log_saved_days?: number // 日志保存天数
      log_user_fields?: string[] // 日志用户字段
    }
  }

}
