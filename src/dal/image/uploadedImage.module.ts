import * as config from 'config'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImageRepository } from './uploadedImage.repository';
import { UploadedImageController } from './uploadedImage.controller';
import { AuthService } from '../user/auth.service';
import { JwtStrategy } from '../user/jwt.strategy';
import { AwsService } from '../../common/aws.service';
import { UploadedImageService } from './uploadedImage.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { LocationService } from '../user/location/location.service';
const jwtConfig = config.get('jwt')

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadedImageRepository, UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn
      }
    })
],
  controllers: [UploadedImageController],
  providers: [AuthService, JwtStrategy, AwsService, UploadedImageService, LocationService],
  exports: [JwtStrategy]
})
export class UplaodedImageModule {}