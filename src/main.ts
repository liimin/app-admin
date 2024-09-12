import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter, ExceptionsFilter } from './common/filters'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局使用中间件
  // app.use(logger)

  // 全局过滤器
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  // app.useGlobalFilters(new ValidateExceptionFilter())
  // 全局管道
  // app.useGlobalPipes(new ValidationPipe());

  // 全局拦截器
  // app.useGlobalInterceptors(new LoggingInterceptor());

  // 设置swagger文档相关配置
  const swaggerOptions = new DocumentBuilder()
    .setTitle('app-admin api document')
    .setDescription('nest starter project api document')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('doc', app, document)
  await app.listen(3000)
}
bootstrap()
