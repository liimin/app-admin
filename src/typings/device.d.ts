declare namespace DeviceTypes {
  /**
   * 查询设备信息的查询对象接口
   *
   * @param user - 用户
   * @param mobile - 手机号
   * @param sn - 设备号
   * @param skip - 可选，跳过的记录数量
   * @param take - 可选，获取的记录数量
   */
  type IQueryDevices = Partial<CommonTypes.IQueryBase & CommonTypes.ISn & IDeviceInfoBase>

  interface IDeviceInfoBase extends CommonTypes.IUser {
    /**
     * 日志保存天数
     */
    log_saved_days?: number
  }
  /**
   * 设备信息接口
   */
  interface IDeviceInfo extends Omit<IDeviceInfoBase,'device_id'>, CommonTypes.PartialOne<IDevice, 'id'>, DeviceStatus.Status {
    /**
     * 日志用户字段
     */
    log_user_fields?: string[]
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
  interface IDeviceInfoInput extends IDeviceInfoBase, CommonTypes.IId, CommonTypes.IDeviceId, CommonTypes.ITime {
    last_log_upload_time?: string
    last_log_remove_time?: string
  }

  type UpdateDeviceInfo = CommonTypes.Optional<IDeviceInfoInput, 'device_id'>
  /**
   * 表示设备结果的接口
   */
  interface IDeviceResult extends IDevice {
    /**
     * 与设备关联的详细信息
     */
    device_info: IDeviceInfoRes
  }

  interface IDevice extends CommonTypes.IId,CommonTypes.ISn {
 
    /**
     * 设备创建的时间戳
     */
    create_time?: number
  }

  /**
   * 表示设备详细信息的接口
   */
  interface IDeviceInfoRes extends CommonTypes.PartialOne<Omit<IDeviceInfoBase,'device_id'>,'sn'>, CommonTypes.PartialOne<IDeviceInfoInput, 'created_at' | 'updated_at' | 'id' | 'device_id'|'sn'> {
    /**
     * 与设备关联的日志配置信息
     */
    log_config: Partial<ConfigTypes.ILogConfig>

    device_status: DeviceStatus.Status
  }
  /**
   * 表示日志配置的接口
   */
  interface ILogConfig {
    /**
     * 日志保存的天数
     */
    log_saved_days: number
    /**
     * 日志用户字段的配置信息
     */
    user_fields: ILogUserFields[]
  }

  /**
   * 表示日志用户字段的接口
   */
  interface ILogUserFields {
    /**
     * 日志用户字段的详细信息
     */
    log_user_field?: CommonTypes.Optional<Partial<UserFieldTypes.ILogUserFields>, 'name'>
  }
}
