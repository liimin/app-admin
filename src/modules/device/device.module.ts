import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device as DeviceEntity } from '../entities/Device';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  controllers: [DeviceController],
  providers: [DeviceService,PrismaService],
})
export class DeviceModule {}
