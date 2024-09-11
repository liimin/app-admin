type ResponseBase = {
  code?: number // 状态码
  msg?: string // 响应信息
  url?: string // 请求接口路径
  timestamp: number // 时间戳
}
type pagenation = {
  current?: number // 页码
  size?: number // 当前页条数
  total?: number // 总条数
}
/**
 * @description: 全局响应体
 */
export type Response<T = any> = {
  data?: T // 业务数据
} & ResponseBase & pagenation
/**
 * @description: 分页数据
 */
export type PageResponse<T = any> = {
  current?: number // 页码
  size?: number // 当前页条数
  total?: number // 总条数
  data: T[] // 业务数据
} & ResponseBase
