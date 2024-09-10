import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { BodyResponse, Response } from '../../common/utils'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(map(data => BodyResponse(data)))
  }
}
