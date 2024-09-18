import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common'
// import { Repository, Connection, getRepository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Device as DeviceEntity } from '../entities/Device'
import { PrismaService } from 'nestjs-prisma'
import { AddDeviceInfoDto } from '../../dto/device.dto'
import { WsConnEvents, WsStatus } from '../../common/enums'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class DeviceService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {
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
    const result: DeviceTypes.IDeviceResult[] = await this.prisma.device.findMany({
      skip,
      take,
      select: {
        sn: true,
        device_info: {
          select: {
            user: true,
            status: true,
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
            }
          }
        }
      },
      where
    })
    const total = await this.prisma.device.count({
      where
    })
    const data: DeviceTypes.IDeviceInfo[] = result.reduce((pre: DeviceTypes.IDeviceInfo[], cur: DeviceTypes.IDeviceResult) => {
      pre.push({
        sn: cur.sn,
        user: cur.device_info?.user,
        mobile: cur.device_info?.mobile,
        status: cur.device_info?.status,
        merchant_name: cur.device_info?.merchant_name,
        log_saved_days: cur.device_info?.log_config?.log_saved_days,
        log_user_fields: cur.device_info?.log_config?.user_fields?.map((item: DeviceTypes.ILogUserFields) => item.log_user_field.name)
      })
      return pre
    }, [])
    const resBody: CommonTypes.IResData<DeviceTypes.IDeviceInfo[]> = { total, data }
    return resBody
  }

  async addDevice(device: Omit<DeviceTypes.IDevice,'id'|'create_time'>) {
    return await this.prisma.device.create({ data: device })
  }

  async addDeviceInfo(deviceInfo: AddDeviceInfoDto) {
    deviceInfo.created_at = new Date()
    deviceInfo.updated_at = new Date()
    deviceInfo.status = WsStatus.Offline
    return await this.prisma.device_info.create({ data: deviceInfo })
  }

  async updateDeviceInfo(deviceInfo: AddDeviceInfoDto) {
    const {device_id,...data} = deviceInfo
    data.updated_at = new Date()
    return await this.prisma.device_info.update({
      where: {
        device_id: deviceInfo.device_id
      },
      data,
    })
  }
}
