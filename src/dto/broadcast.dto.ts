import { ApiProperty } from '@nestjs/swagger'

import { WsMessageType } from '../common/enums'
import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class DataDto {
  @ApiProperty({
    type: String,
    description: '命令类型'
  })
  @IsString({ message: '命令为必填参数' })
  @IsNotEmpty({ message: '命令不能为空' })
  readonly order: string

  @ApiProperty({
    description: '下发的参数',
  })
  readonly payload: any
}
export class BroadcastDto {
  @ApiProperty({
    type: WsMessageType,
    description: '事件类型: private-私有消息,system-系统消息',
    default: WsMessageType.Private
  })
  @IsNotEmpty({ message: '事件类型不能为空' })
  readonly event: WsMessageType

  @ValidateIf(o => o.event === WsMessageType.Private)
  @IsDefined({ message: '发送私有消息时,device_id是必填的' })
  @IsNumber({},{ message: 'device_id必须是数字'})
  @ApiProperty({
    type: Number,
    description: '设备号,私发信息必填',
    default: ''
  })
  readonly device_id: number

  @IsNotEmpty({ message: '消息不能为空' })
  @ApiProperty({ description: '要发送的数据' })
  @ValidateNested()
  @Type(() => DataDto)
  readonly data: DataDto
}

