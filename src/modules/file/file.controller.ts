import { Controller, Post, UploadedFile, UseInterceptors, Get, Res, Req, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Response, Request } from 'express'
import { FileMimeTypeFilter } from '../../common/filters'
import { UploadFile } from '../../common/decorators'
import { DocTypes } from 'src/common/enums'
import { FileDto } from '../../dto'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('file')
@UsePipes(new ValidationPipe())
@Controller('file')
export class FileController {
  /**
   * 文件服务的构造函数。
   *
   * @param fileService - 文件服务的实例，用于处理文件相关操作。
   */
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件的方法
   * 该方法接收一个文件对象和一个请求对象，并将文件信息保存到数据库中
   * @param file - 包含文件信息的Express.Multer.File对象
   * @param req - 包含请求信息的Request对象
   * @returns 返回上传的文件对象
   */
  @Post('upload')
  @UploadFile('file', { fileFilter: FileMimeTypeFilter('text/plain'), limits: { fileSize: 1024 * 1024 * 100 } })
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request): FileTypes.IFile<DocTypes> {
    const { fieldname, encoding, destination, stream, buffer, ...o } = file
    const bodyData: Pick<FileTypes.IFile<DocTypes>, 'device_id' | 'type'> = { device_id: Number(req.body.deviceId), type: req.body.type }
    const fi: FileTypes.IFile<DocTypes> = Object.assign({ created_at: new Date() }, bodyData, o)
    this.fileService.save(fi)
    return fi
  }

  /**
   * 删除文件的方法
   * 该方法接收一个文件ID，并将文件从数据库中删除
   * @param id - 要删除的文件ID
   * @returns 返回删除结果
   */
  @Get('delete')
  async remove(@Query() { id }: FileDto): Promise<CommonTypes.IResData<CommonTypes.IResponseBase>> {
    return await this.fileService.remove(+id)
  }

  /**
   * 导出所有文件的方法
   * 该方法将所有文件打包成一个tar文件并返回给客户端
   * @param res - 包含响应信息的Response对象
   * @returns 返回打包后的tar文件
   */
  @Get('export')
  async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.fileService.downloadAll()
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    tarStream.pipe(res)
  }
}
