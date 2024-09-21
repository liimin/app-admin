import { types } from 'util'
import { RESPONSE_CODE, RESPONSE_MSG } from '../enums'

export const getCurrentTimestamp = (): number => {
  return Date.parse(new Date().toString()) / 1000
}

/**
 * @description: 统一返回体
 */
export const BodyResponse: CommonTypes.TBodyResponse = (result, message, code, error, url) => {
  if (message instanceof Array) {
    message = message.join(';')
  }
  const { total, data } = result || {}
  return {
    url,
    data,
    total,
    error,
    timestamp: getCurrentTimestamp(),
    message: data?.message || message || RESPONSE_MSG.SUCCESS,
    code: data?.code || code || RESPONSE_CODE.SUCCESS
  }
}
