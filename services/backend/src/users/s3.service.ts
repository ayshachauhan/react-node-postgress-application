import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;
  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId:
          this.configService.get(ENVIRONMENT_VARIABLES.AWS_ACCESS_KEY_ID) ?? '',
        secretAccessKey:
          this.configService.get(ENVIRONMENT_VARIABLES.AWS_SECRET_ACCESS_KEY) ??
          '',
      },
      region: this.configService.get(ENVIRONMENT_VARIABLES.AWS_DEFAULT_REGION),
    });
    this.bucketName = `azentia-${this.configService.get(
      ENVIRONMENT_VARIABLES.ENVIRONMENT,
    )}`;
  }

  // add type here
  async uploadFile(file): Promise<AWS.S3.ManagedUpload.SendData> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      })
      .promise();

    return uploadResult;
  }

  async listBucketObjects(): Promise<AWS.S3.ListObjectsV2Output> {
    const listObjectsResult = await this.s3
      .listObjectsV2({
        Bucket: this.bucketName,
      })
      .promise();

    return listObjectsResult;
  }
}
