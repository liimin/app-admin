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

declare module ConfigTypes {
  interface ILogConfig {
    id: number
    device_id: number
    log_saved_days: number
    created_at: Date | string
    updated_at: Date | string
    user_fields: DeviceTypes.ILogUserFields[]
  }
  type LogConfigQuery = Pick<Partial<ILogConfig>, 'device_id'> & CommonTypes.IQueryBase
  type LogConfigAdd = Omit<Partial<ILogConfig>, 'id' | 'user_fields'> & { user_fields: number[] }
  type LogConfigResult = Partial<ILogConfig>
  type LogConfigResponse = Omit<LogConfigResult, 'user_fields'> & { user_fields: string[] }
  type LogConfigUpdate = CommonTypes.Optional<ILogConfig, 'device_id'>
}
