import { Module } from '@nestjs/common'
import { ConfigController } from './config.controller'
import { ConfigService } from './config.service'
import { PrismaService } from 'nestjs-prisma'
@Module({
  controllers: [ConfigController],
  providers: [ConfigService,PrismaService]
})
export class LogConfigModule {}
