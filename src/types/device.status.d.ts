declare namespace DeviceStatus {
  interface IDeviceStatus extends CommonTypes.IDeviceId{
    status: number
  }
  type Status = Omit<IDeviceStatus,'device_id'>
}
