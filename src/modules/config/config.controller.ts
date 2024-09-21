import { Controller, Post, Body, UseInterceptors, Get, UsePipes, Param, Query } from '@nestjs/common'
import { ConfigService } from './config.service'
import { TransformInterceptor } from '../../common/interceptors'
import { LogConfigDto } from '../../dto/config.dto'
import { PagesPipe, ValidationPipe } from '../../common/pipes'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('config')
@Controller('config')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @UsePipes(new PagesPipe())
  async findAll(@Query() params: ConfigTypes.LogConfigQuery): Promise<CommonTypes.IResData<ConfigTypes.LogConfigResponse[]>> {
    return this.configService.findAll(params)
  }
  @Post('/add')
  addConfig(@Body() param: LogConfigDto): Promise<CommonTypes.IResData> {
    return this.configService.addConfig(param)
  }
}
