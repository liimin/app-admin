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
  interface IQueryDevices extends CommonTypes.IQueryBase {
    user?: string
    mobile?: string
    sn?: string
  }
  interface IDeviceInfoBase {
    /**
     * 用户
     */
    user?: string
    /**
     * 手机号
     */
    mobile?: string
    /**
     * 商户名称
     */
    merchant_name?: string
    /**
     * 状态
     */
    status?: number
    /**
     * 日志保存天数
     */
    log_saved_days?: number
  }
  /**
   * 设备信息接口
   */
  interface IDeviceInfo extends IDeviceInfoBase, IDevice {
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
  interface IDeviceInfoInput extends IDeviceInfoBase {
    id?: number
    last_log_upload_time?: string
    last_log_remove_time?: string
    device_id?: number
    created_at?: number
    updated_at?: number
  }

  /**
   * 表示设备结果的接口
   */
  interface IDeviceResult extends IDevice {
    /**
     * 与设备关联的详细信息
     */
    device_info: IDeviceInfoRes
  }

  interface IDevice {
    /**
     * 设备的唯一标识符
     */
    id?: number
    /**
     * 设备的序列号
     */
    sn: string
    /**
     * 设备创建的时间戳
     */
    create_time?: number
  }

  /**
   * 表示设备详细信息的接口
   */
  interface IDeviceInfoRes extends IDeviceInfoBase {
    /**
     * 设备信息的唯一标识符
     */
    id?: number
    /**
     * 设备的唯一标识符（外键）
     */
    device_id?: number
    /**
     * 上次日志上传的时间
     */
    last_log_upload_time?: string
    /**
     * 上次日志移除的时间
     */
    last_log_remove_time?: string
    /**
     * 设备信息创建的时间戳
     */
    created_at?: number
    /**
     * 设备信息更新的时间戳
     */
    updated_at?: number
    /**
     * 与设备关联的日志配置信息
     */
    log_config: ILogConfig
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
    log_user_field?: ILogUserField
  }

  /**
   * 表示日志用户字段的详细信息的接口
   */
  interface ILogUserField {
    /**
     * 日志用户字段的唯一标识符
     */
    id?: number
    /**
     * 日志用户字段的名称
     */
    name: string
  }
}
