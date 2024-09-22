import { ApiProperty } from '@nestjs/swagger'

import { Command, WsMessageType } from '../common/enums'
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, isString, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'

class DataDto {
  @ApiProperty({
    type: String,
    description: '指令类型'
  })
  @IsEnum(Command, { message: '指令类型错误' })
  @IsString({ message: '指令为必填参数' })
  @IsNotEmpty({ message: '指令不能为空' })
  readonly command: Command

  @ApiProperty({
    description: '下发的参数'
  })
  readonly payload: unknown
}
export class BroadcastDto {
  @ApiProperty({
    type: String,
    description: '事件类型: private-私有消息,system-系统消息',
  })
  @IsEnum(WsMessageType, { message: '事件类型错误' })
  @IsNotEmpty({ message: '事件类型不能为空' })
  readonly event: WsMessageType

  @ValidateIf(o => o.event === WsMessageType.Private)
  @IsDefined({ message: '发送私有消息时,device_id是必填的' })
  @Transform(({ value }) => (isString(value) && !isNaN(Number(value)) ? value : undefined), {
    toClassOnly: true,
  })
  @Matches(/[0-9]+$/, { message: '设备ID必须是数字' })
  @ApiProperty({
    type: Number,
    description: '设备号,私发信息必填',
  })
  readonly device_id: number

  @IsNotEmpty({ message: '消息不能为空' })
  @ApiProperty({ description: '要发送的数据' })
  @ValidateNested()
  @Type(() => DataDto)
  readonly data: any
}
