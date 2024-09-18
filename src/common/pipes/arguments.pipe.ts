import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class PagesPipe implements PipeTransform<CommonTypes.IPageIn> {
  async transform(value: CommonTypes.IPageIn) {
    console.log(value)
    const { pageIndex=1, pageSize =10 } = value
    const skip = (pageIndex - 1) * pageSize
    value.skip = +skip < 0 ? 0 : skip
    value.take = +pageSize
    return value
  }
}
