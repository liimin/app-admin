import { types } from 'util'
import { RESPONSE_CODE, RESPONSE_MSG } from '../enums'

export const getCurrentTimestamp = (): number => {
  return Date.parse(new Date().toString()) / 1000
}

/**
 * @description: 统一返回体
 */
export const BodyResponse: CommonTypes.TBodyResponse = ({ message = RESPONSE_MSG.SUCCESS, code = RESPONSE_CODE.SUCCESS, error, url, total, data }) => {
  if (message instanceof Array) {
    message = message.join(';')
  }
  return { url, data, total, error, message, code, timestamp: getCurrentTimestamp() }
}
