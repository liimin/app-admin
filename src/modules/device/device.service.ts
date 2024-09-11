import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common'
// import { Repository, Connection, getRepository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Device as DeviceEntity } from '../entities/Device'
import { PrismaService } from 'nestjs-prisma'
@Injectable()
export class DeviceService {
  constructor(
    // @InjectRepository(DeviceEntity)/
    // private readonly deviceRepository: Repository<DeviceEntity>,
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {}

  async findAll({ user, mobile, sn, pageSize, pageindex }: Api.Device.QueryDevice): Promise<Api.Device.DeviceInfo[]> {
    const result = await this.prisma.device.findMany({
      // skip,
      // take,
      select: {
        sn: true,
        'device_info': {
          select: {
            user: true,
            status: true,
            'log_config': {
              select: {
                'log_saved_days': true,
                'user_fields': {
                  select: {
                    'log_user_field': {
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
      where: {
        sn:{
          contains: sn
        },
        AND: {
          'device_info': {
            mobile: {
              contains: mobile
            },
            user: {
              contains: user
            }
          }
        }
      }
    })
    const data = result.reduce((pre, cur) => {
      pre.push({
        sn: cur.sn,
        user: cur.device_info?.user,
        status: cur.device_info?.status,
        'log_saved_days': cur.device_info?.log_config?.log_saved_days,
        'log_user_fields': cur.device_info?.log_config?.user_fields?.map(item => item.log_user_field.name)
      })
      return pre
    }, [])
    return data
  }

  // async create(user): Promise<DeviceEntity[]> {
  //   const { name } = user;
  //   const u = await getRepository(DeviceEntity).findOne({ where: { name } });
  //   //   .createQueryBuilder('users')
  //   //   .where('users.name = :name', { name });
  //   // const u = await qb.getOne();
  //   if (u) {
  //     throw new HttpException(
  //       {
  //         message: 'Input data validation failed',
  //         error: 'name must be unique.',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return await this.deviceRepository.save(user);
  // }

  // async createMany(users: DeviceEntity[]) {
  // const queryRunner = this.connection.createQueryRunner();

  // await queryRunner.connect();
  // await queryRunner.startTransaction();
  // try {
  //   users.forEach(async user => {
  //     await queryRunner.manager.getRepository(DeviceEntity).save(user);
  //   });

  //   await queryRunner.commitTransaction();
  // } catch (err) {
  //   // since we have errors lets rollback the changes we made
  //   await queryRunner.rollbackTransaction();
  // } finally {
  //   // you need to release a queryRunner which was manually instantiated
  //   await queryRunner.release();
  // }
  // }
}
