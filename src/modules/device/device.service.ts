import { Inject,Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Device as DeviceEntity } from '../entities/Device'
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    private connection: Connection,
  ) {}

  async findAll(): Promise<any> {
    // relations: ['photos']， 联合查询
    return await this.prisma.device.findMany();
    
    // 或者使用queryBuilder
    // return await getRepository(UsersEntity)
    //   .createQueryBuilder("user")
    //   .leftJoinAndSelect("user.photos", "photo")
    //   .getMany()
  }

  async create(user): Promise<DeviceEntity[]> {
    const { name } = user;
    const u = await getRepository(DeviceEntity).findOne({ where: { name } });
    //   .createQueryBuilder('users')
    //   .where('users.name = :name', { name });
    // const u = await qb.getOne();
    if (u) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          error: 'name must be unique.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.deviceRepository.save(user);
  }

  async createMany(users: DeviceEntity[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      users.forEach(async user => {
        await queryRunner.manager.getRepository(DeviceEntity).save(user);
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
