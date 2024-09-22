import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, isString, Matches } from "class-validator"

/*
model log_config {
  id             Int                             @id @default(autoincrement())
  device_id      Int                             @unique(map: "device_id") @default(0)
  log_saved_days Int?                            @default(7) @db.TinyInt
  created_at     DateTime                        @default(now()) @db.Timestamp(0)
  updated_at     DateTime                        @default(now()) @db.Timestamp(0)
  device         device                          @relation(fields: [device_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_log_config_device")
  device_info    device_info                     @relation(fields: [device_id], references: [device_id], onDelete: NoAction, onUpdate: NoAction, map: "FK_log_config_device_info")
  user_fields    log_config_userfield_relation[]
}*/
export class LogConfigDto {
    @ApiProperty({
      type: Number,
      description: '设备信息ID',
      required: false,
      default: 0
    })
    id: number
    @ApiProperty({
      type: Number,
      description: '设备ID',
      required: true,
      default: 0
    })
    @Transform(({ value }) => (isString(value) && !isNaN(Number(value)) ? value : undefined), {
      toClassOnly: true,
    })
    @Matches(/[0-9]+$/, { message: '设备ID必须是数字' })
    @IsNotEmpty({ message: '设备ID不能为空' })
    device_id: number
  
    @ApiProperty({
      type: Number,
      description: '日志保存天数',
      required: false,
      default: ''
    })
    log_saved_days: number
  
  
    @ApiProperty({
      type: Number,
      description: '创建时间',
      required: false,
      default: ''
    })
    created_at: Date | string
  
    @ApiProperty({
      type: Date,
      description: '更新时间',
      required: false,
      default: ''
    })
    updated_at: Date | string
  
  
    @ApiProperty({
      type: Array,
      description: '需要上传的用户字段',
      required: false,
      default: []
    })
    user_fields: []
  }
