import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { RESPONSE_CODE } from '../../common/enums'
@Injectable()
export class ConfigService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {}
  async findAll({ device_id, skip, take }: ConfigTypes.LogConfigQuery): Promise<CommonTypes.IResData<ConfigTypes.LogConfigResponse[]>> {
    const where: any = {
      device_id
    }
    const result: ConfigTypes.LogConfigResult[] = await this.prisma.log_config.findMany({
      skip,
      take,
      select: {
        id: true,
        device_id: true,
        log_saved_days: true,
        user_fields: {
          select: {
            log_user_field: {
              select: {
                name: true
              }
            }
          }
        }
      },
      where
    })
    const data: ConfigTypes.LogConfigResponse[] = result.map(item => {
      return {
        id: item.id,
        device_id: item.device_id,
        log_saved_days: item.log_saved_days,
        user_fields: item.user_fields.map(item => item.log_user_field.name)
      }
    })
    const total = await this.prisma.log_config.count({
      where
    })
    const resBody: CommonTypes.IResData<ConfigTypes.LogConfigResponse[]> = { total, data }
    return resBody
  }

  async addConfig(config: ConfigTypes.LogConfigAdd): Promise<CommonTypes.IResData> {
    const { user_fields, ...data } = config
    let config_id: number = 0
    await this.prisma.$transaction(async prisma => {
      const date = new Date()
      const { id } = (await prisma.log_config.findUnique({ where: { device_id: data.device_id }, select: { id: true } })) || {}
      config.updated_at = date
      if (id) {
        config_id = id
        await prisma.log_config.update({ where: { device_id: data.device_id }, data })
        await prisma.log_config_userfield_relation.deleteMany({ where: { config_id: id } })
      } else {
        config.created_at = date
        const { id } = await prisma.log_config.create({ data, select: { id: true } })
        config_id = id
      }
      const relations: RelationsTypes.LogConfigUserFieldsRel[] = user_fields.map((ufid: number) => {
        return {
          config_id,
          user_field_id: ufid
        }
      })
      await prisma.log_config_userfield_relation.createMany({ data: relations, skipDuplicates: true })
    })
    return {  code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功'  }
  }

 
}
