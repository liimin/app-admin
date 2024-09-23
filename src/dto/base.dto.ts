import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { isString, Matches } from 'class-validator'

export class BaseDto {
  @ApiProperty({
    type: Number,
    description: '设备ID',
    required: false,
    default: 0
  })
  device_id?: number
  @ApiProperty({
    type: Number,
    description: '每页显示的条数',
    required: false,
    default: 10
  })
  pageSize?: number

  @ApiProperty({
    type: Number,
    description: '当前页码',
    required: false,
    default: 1
  })
  pageIndex?: number
}
