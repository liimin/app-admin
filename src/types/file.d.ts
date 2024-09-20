declare namespace FileTypes {
  interface IFile<T> {
    originalname: string
    mimetype: string
    filename: string
    path: string
    size: number,
    device_id: number,
    created_at: Date,
    type: T
  }
}
