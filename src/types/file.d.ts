declare namespace FileTypes {
  interface IFile<T> extends CommonTypes.IDeviceId, Pick<CommonTypes.ITime,'created_at'> {

    originalname: string
    mimetype: string
    filename: string
    path: string
    size: number,
    type: T
  }
}
