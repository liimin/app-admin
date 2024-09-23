import { Inject, Injectable, HttpException, HttpStatus, OnModuleInit, Logger } from '@nestjs/common'
// import { Repository, Connection, getRepository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Device as DeviceEntity } from '../entities/Device'
import { PrismaService } from 'nestjs-prisma'
import { Command, FileCommand, RESPONSE_CODE, WsMessageType, WsStatus } from '../../common/enums'
import { WsGateway } from '../ws/ws.gateway'

@Injectable()
export class DeviceService implements OnModuleInit {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService, // private connection: Connection,
    private readonly wsGateway: WsGateway
  ) {}
  async onModuleInit() {
    this.resetAllDeviceStatus()
  }

  async findAll({ user, mobile, sn, skip, take }: DeviceTypes.IQueryDevices): Promise<CommonTypes.IResData<DeviceTypes.IDeviceInfo[]>> {
    const where = {
      sn: {
        contains: sn
      },
      AND: {
        device_info: {
          mobile: {
            contains: mobile
          },
          user: {
            contains: user
          }
        }
      }
    }
    const result: Omit<DeviceTypes.IDeviceResult, 'id'>[] = await this.prisma.device.findMany({
      skip,
      take,
      select: {
        sn: true,
        device_info: {
          select: {
            user: true,
            mobile: true,
            merchant_name: true,
            log_config: {
              select: {
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
              }
            },
            device_status: {
              select: { status: true }
            }
          }
        }
      },
      where
    })
    const total: number = await this.prisma.device.count({
      where
    })
    const data: DeviceTypes.IDeviceInfo[] = result.reduce((pre: DeviceTypes.IDeviceInfo[], cur: DeviceTypes.IDeviceResult) => {
      pre.push({
        sn: cur.sn,
        user: cur.device_info?.user,
        mobile: cur.device_info?.mobile,
        status: cur.device_info?.device_status?.status,
        merchant_name: cur.device_info?.merchant_name,
        log_saved_days: cur.device_info?.log_config?.log_saved_days,
        log_user_fields: cur.device_info?.log_config?.user_fields?.map((item: DeviceTypes.ILogUserFields) => item.log_user_field.name)
      })
      return pre
    }, [])
    const resBody: CommonTypes.IResData<DeviceTypes.IDeviceInfo[]> = { total, data }
    return resBody
  }

  async addDevice(device: Omit<DeviceTypes.IDevice, 'id' | 'create_time'>): Promise<CommonTypes.IResData> {
    await this.prisma.$transaction(async prisma => {
      const { id } = await prisma.device.create({ data: device, select: { id: true } })
      // await this.addDeviceInfo({device_id:id})
      await prisma.device_info.create({ data: { device_id: id, created_at: new Date(), updated_at: new Date() } })
      await prisma.device_status.create({ data: { device_id: id, status: WsStatus.Offline } })
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '添加设备成功' }
  }

  async addDeviceInfo(deviceInfo: Omit<DeviceTypes.IDeviceInfoInput, 'sn'>): Promise<CommonTypes.IResData> {
    deviceInfo.created_at = new Date()
    deviceInfo.updated_at = new Date()
    await this.prisma.$transaction(async prisma => {
      await prisma.device_info.create({ data: deviceInfo })
      await prisma.device_status.create({ data: { device_id: deviceInfo.device_id, status: WsStatus.Offline } })
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '添加设备信息成功' }
  }

  async updateDeviceInfo(deviceInfo: Omit<DeviceTypes.IDeviceInfoInput, 'sn'>): Promise<CommonTypes.IResData> {
    const { device_id, ...data } = deviceInfo
    data.updated_at = new Date()
    await this.prisma.device_info.update({
      where: {
        device_id: deviceInfo.device_id
      },
      data
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备信息更新成功' }
  }
  async upsertDeviceStatus(data: DeviceStatus.IDeviceStatus): Promise<CommonTypes.IResData> {
    await this.prisma.device_status.upsert({
      where: {
        device_id: data.device_id
      },
      create: data,
      update: {
        status: data.status
      }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }
  async resetAllDeviceStatus(): Promise<CommonTypes.IResData> {
    Logger.debug('===重置所有设备状态===')
    await this.prisma.device_status.updateMany({
      data: {
        status: WsStatus.Offline
      }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }

  async addAll(devices: Array<any>): Promise<CommonTypes.IResponseBase> {
    for (let index = 0; index < devices.length; index++) {
      const el = devices[index]
      await this.prisma.$transaction(async prisma => {
        const { id } = await prisma.device.create({ data: { sn: el.设备编号 }, select: { id: true } })
        await prisma.device_info.create({ data: { device_id: id, mobile: el.手机号, merchant_name: el.最近使用人所在门店 || '', user: el.保管人, created_at: new Date(), updated_at: new Date() } })
        await prisma.device_status.create({ data: { device_id: id, status: WsStatus.Offline } })
        const { id: cfgid } = await prisma.log_config.create({ data: { device_id: id, log_saved_days: 7 }, select: { id: true } })
        await prisma.log_config_userfield_relation.createMany({
          data: [
            { config_id: cfgid, user_field_id: 1 },
            { config_id: cfgid, user_field_id: 2 },
            { config_id: cfgid, user_field_id: 3 }
          ]
        })
      })
    }
    return { code: RESPONSE_CODE.SUCCESS, message: '添加成功' }
  }

  async removeFilesTask(): Promise<CommonTypes.IResData> {
    const results: (CommonTypes.IDeviceId & Pick<DeviceTypes.IDeviceInfoBase, 'log_saved_days'>)[] = await this.prisma.$queryRaw<(CommonTypes.IDeviceId & Pick<DeviceTypes.IDeviceInfoBase, 'log_saved_days'>)[]>`
      	SELECT d.device_id, c.log_saved_days
        FROM device_info d
        JOIN log_config c ON c.device_id = d.device_id
        WHERE c.log_saved_days >= TIMESTAMPDIFF(DAY, d.last_log_remove_time, NOW());`
    for (const { device_id, log_saved_days } of results) {
      await this.wsGateway.send({ event: WsMessageType.Private, device_id, data: { command: Command.File, payload: { command: FileCommand.Remove, days: log_saved_days } } })
    }
    return { code: RESPONSE_CODE.SUCCESS, message: '每日日志删除任务完成' }
  }
}
