import { types } from 'util'
import { RESPONSE_CODE, RESPONSE_MSG } from '../enums'

export const getCurrentTimestamp = (): number => {
  return Date.parse(new Date().toString()) / 1000
}

/**
 * @description: 统一返回体
 */
export const BodyResponse: CommonTypes.TBodyResponse = (result, msg, code,error, url) => {
  if(msg instanceof Array){
    msg = msg.join(';')
  }
  const { total, data } = result || {}
  return {
    url,
    data,
    total,
    error,
    'timestamp': getCurrentTimestamp(),
    'msg': msg || RESPONSE_MSG.SUCCESS,
    'code': code || RESPONSE_CODE.SUCCESS
  }
}
