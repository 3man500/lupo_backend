import { Controller, UseInterceptors, Post, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthService } from '../user/auth.service';
import { AwsService } from '../../common/aws.service';
import { UploadedImageService } from './uploadedImage.service';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

@Controller('uploaded-image')
export class UploadedImageController{
    constructor(
        private readonly authService: AuthService,
        private readonly awsService: AwsService,
        private readonly uploadedImageService: UploadedImageService){}
    @UseInterceptors(FileInterceptor('image'))
    // @UseGuards(AuthGuard())
    // @ApiBearerAuth('access-token')
    @Post('/profile/image/upload')
    async uploadProfileImage(
        @UploadedFile('file') file: Express.Multer.File,@Req() req: Request
    ){
        console.log(file)
        const uploadRes = await this.awsService.uploadFileToS3('posts', file);
        console.log(uploadRes)
        //console.log("cookie", req.cookies.access_token)
        const authUser = await this.authService.decodeJwt(req)

        this.uploadedImageService.uploadProfileImage(file.originalname, uploadRes.url, '0', 0, authUser.userId)

    }

}