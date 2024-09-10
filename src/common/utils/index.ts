import { RESPONSE_CODE, RESPONSE_MSG } from '../enums';
import type { Response } from './types';

export const getCurrentTimestamp = (): number=> {
    return Date.parse(new Date().toString()) / 1000;
}
 /**
  * @description: 统一返回体
  */
 export const BodyResponse = <T = any>(
   data,
   msg?: string ,
   code?: number,
   url?: string 
 ): Response<T> => {
   return {
     code:code || RESPONSE_CODE.SUCCESS,
     msg:msg || RESPONSE_MSG.SUCCESS,
     data,
     timestamp: getCurrentTimestamp(),
     url,
   };
 };
 export * from './types';