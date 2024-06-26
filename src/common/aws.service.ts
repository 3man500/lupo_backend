import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as config from 'config';

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    const awsConfig = config.get('aws')
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.S3ACCESSKEY || awsConfig.s3AccessKey, // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: process.env.S3SECERTKEY || awsConfig.s3SecretKey,
      region: process.env.S3REGION || awsConfig.s3Region,
    });
    this.S3_BUCKET_NAME = process.env.S3BUCKET || awsConfig.s3Bucket; // nest-s3
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
    url: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');
      // 공백을 제거해주는 정규식

      console.log(this.S3_BUCKET_NAME)
      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
        const imgUrl = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      return { key, s3Object, contentType: file.mimetype, url: imgUrl };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }

  async getPresignedUrl(objectKey: string){
    const objectParams_preSign = {
        Bucket: this.S3_BUCKET_NAME,
        Key: objectKey,
        Expires: 60*60, // 60초 동안만 url 유지
     };
     const result = await this.awsS3
        .getSignedUrlPromise('getObject', objectParams_preSign)
        .then((data) => {
           console.log('Presigned URL : ', data);
           return data
        })
        .catch((error) => {
           console.error(error);
           throw new BadRequestException("s3 image download error", error)
        });

        return result
  }
}