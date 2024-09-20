import { Inject, Injectable } from '@nestjs/common'
import { tar } from 'compressing'
import { ConfigService } from 'nestjs-config'
import * as fs from 'fs'
import * as path from 'path'
import { DocTypes, RESPONSE_CODE } from '../../common/enums'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class FileService {
  /**
   * 文件服务的构造函数。
   *
   * @param configService - 配置服务的实例，用于获取配置信息。
   * @param prisma - PrismaService的实例，用于数据库操作。
   */
  constructor(
    private readonly configService: ConfigService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {}

  /**
   * 保存文件到数据库的方法。
   *
   * @param file - 要保存的文件对象，包含文件名、路径、创建时间等信息。
   * @returns 一个 Promise，成功时解析为包含操作结果的 CommonTypes.IResData 对象。
   */
  async save(file: FileTypes.IFile<DocTypes>): Promise<CommonTypes.IResData<CommonTypes.IResponseBase>> {
    const { filename, path, created_at, ...where } = file
    this.prisma.$transaction(async prisma => {
      const { id, path: origin_path } = (await prisma.file.findFirst({ where, select: { id: true, path: true } })) || {}
      if (id) {
        fs.unlinkSync(origin_path)
        return await prisma.file.update({ where: { id }, data: { filename, path, created_at } })
      } else {
        return await prisma.file.create({ data: file })
      }
    })
    return { data: { code: RESPONSE_CODE.SUCCESS, msg: '文件保存成功' } }
  }

  /**
   * 从数据库中移除文件。
   *
   * @param id - 要移除的文件的唯一标识符。
   * @returns 一个 Promise，成功时解析为包含操作结果的 CommonTypes.IResData 对象。
   */
  async remove(id: number): Promise<CommonTypes.IResData<CommonTypes.IResponseBase>> {
    await this.prisma.$transaction(async prisma => {
      const { path } = (await prisma.file.findFirst({ where: { id }, select: { path: true } })) || {}
      await prisma.file.delete({ where: { id } })
      fs.unlinkSync(path)
    })
    return { data: { code: RESPONSE_CODE.SUCCESS, msg: '删除成功' } }
  }

  
  async downloadAll() {
    const uploadDir = this.configService.get('file').root
    const tarStream = new tar.Stream()
    await tarStream.addEntry(uploadDir)
    return { filename: 'hello-world.tar', tarStream }
  }
  moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const rs = fs.createReadStream(sourcePath)
      const ws = fs.createWriteStream(destinationPath)
      rs.on('error', reject)
      ws.on('error', reject)
      ws.on('finish', resolve)
      rs.pipe(ws)
    })
  }
}
