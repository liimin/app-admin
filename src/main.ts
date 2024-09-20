import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter, ExceptionsFilter } from './common/filters'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { docBuilder, wsRedisAdapter } from './initor'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 全局使用中间件
  // app.use(logger)

  // 全局过滤器
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors()
  await wsRedisAdapter(app)
  // app.useWebSocketAdapter(new WsAdapter(app))
  // app.useGlobalFilters(new ValidateExceptionFilter())
  // 全局管道
  // app.useGlobalPipes(new ValidationPipe());

  // 全局拦截器
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useStaticAssets(join(__dirname, '..', process.env.STATIC_PATH))

  docBuilder(app)
  await app.listen(3000)
}
bootstrap()
