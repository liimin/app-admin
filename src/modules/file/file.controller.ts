import { Controller, Post, UploadedFile, UseInterceptors, Get, Res, Req } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Response, Request } from 'express'
import { FileMimeTypeFilter } from '../../common/filters'
import { UploadFile } from '../../common/decorators'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UploadFile('file', { fileFilter: FileMimeTypeFilter('text/plain'), limits: { fileSize: 1024 * 1024 * 100 } })
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log(req.body.deviceId)
    this.fileService.upload(file)
    return file
  }

  @Get('export')
  async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.fileService.downloadAll()
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    tarStream.pipe(res)
  }
}
