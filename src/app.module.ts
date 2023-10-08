import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './dal/user/auth.module';
import { LocationService } from './dal/user/location/location.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
