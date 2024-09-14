import { Controller, Post, UploadedFile, UseInterceptors, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { FileMimeTypeFilter } from '../../common/filters'
import { UploadFile } from '../../common/decorators'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UploadFile('file', { fileFilter: FileMimeTypeFilter('text/plain') })
  upload(@UploadedFile() file: Express.Multer.File) {
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
