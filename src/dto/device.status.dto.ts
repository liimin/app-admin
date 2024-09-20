import { IsString, IsNumber, IsNotEmpty, MaxLength, IsMobilePhone, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeviceStatusDto {
  @ApiProperty({
    type: Number,
    description: '设备ID',
    default: 0
  })
  @IsNumber({}, { message: '设备ID必须是数字' })
  @IsNotEmpty({ message: '设备ID不能为空' })
  device_id: number

  @IsNumber({}, { message: '设备状态必须是数字' })
  @IsNotEmpty({ message: '设备状态不能为空' })
  @ApiProperty({
    type: Number,
    description: '设备状态',
    default: 0
  })
  status: number

  @IsNotEmpty({ message: 'SocketID不能为空' })
  @ApiProperty({
    type: String,
    description: 'SocketID',
    default: ''
  })
  socket_id: string
}
