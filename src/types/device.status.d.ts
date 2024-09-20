declare module DeviceStatus {
  interface IDeviceStatus {
    device_id: number
    status: number
  }
  type Status = Omit<IDeviceStatus,'device_id'>
}
