import { IsString, IsNumber, IsNotEmpty, MaxLength, IsMobilePhone,IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AddDeviceDto {
  @ApiProperty({
    type: String,
    description: '设备SN',
    default: ''
  })
  @MaxLength(20, { message: '设备SN不能超过20个字符' })
  @IsNotEmpty({ message: '设备SN不能为空' })
  sn: string
}
/**
 * model device_info {
  id                   Int         @id @default(autoincrement())
  device_id            Int         @unique(map: "device_id") @default(0)
  user                 String?     @db.VarChar(20)
  status               Int?        @db.TinyInt
  last_log_upload_time String?     @db.VarChar(30)
  last_log_remove_time String?     @db.VarChar(30)
  created_at           DateTime    @default(now()) @db.Timestamp(0)
  updated_at           DateTime    @default(now()) @db.Timestamp(0)
  mobile               String?     @db.VarChar(20)
  merchant_name        String?     @db.VarChar(50)
  log_config           log_config?
}
 */
export class AddDeviceInfoDto {
  @ApiProperty({
    type: Number,
    description: '设备信息ID',
    default: 0
  })
  id: number
  @ApiProperty({
    type: Number,
    description: '设备ID',
    default: 0
  })
  @IsNumber({},{ message: '设备ID必须是数字'})
  @IsNotEmpty({ message: '设备ID不能为空' })
  device_id: number

  @ApiProperty({
    type: String,
    description: '设备用户',
    default: ''
  })
  user: string

  @ApiProperty({
    type: Number,
    description: '设备状态',
    default: 0
  })
  status: number

  @ApiProperty({
    type: String,
    description: '最后一次上传日志的时间',
    default: ''
  })
  last_log_upload_time: string

  @ApiProperty({
    type: String,
    description: '最后一次移除日志的时间',
    default: ''
  })
  last_log_remove_time: string

  @ApiProperty({
    type: Number,
    description: '创建时间',
    default: ''
  })
  created_at: Date | string

  @ApiProperty({
    type: Date,
    description: '更新时间',
    default: ''
  })
  updated_at: Date | string

  @IsMobilePhone('zh-CN',{},{ message: '手机号格式不正确'})
  @IsOptional()
  @ApiProperty({
    type: String,
    description: '使用者手机号',
    default: ''
  })
  mobile: string

  @ApiProperty({
    type: String,
    description: '使用者商户名称',
    default: ''
  })
  merchant_name: string

  @ApiProperty({
    type: Object,
    description: '日志配置',
    default: {}
  })
  log_config: {}
}
