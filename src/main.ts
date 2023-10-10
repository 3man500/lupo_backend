import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { config } from 'rxjs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const serverConfig = config.get('server')
  // const port = serverConfig.port
  app.use(cookieParser())
  await app.listen(3000);
  Logger.log(`server port 3000 is running...`)

}
bootstrap();
