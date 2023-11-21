import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config'
import { LocationService } from './location/location.service';
import { AwsService } from '../../common/aws.service';
import { UploadedImageRepository } from '../image/uploadedImage.repository';

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UploadedImageRepository]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn
      }
    })
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocationService, AwsService],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
