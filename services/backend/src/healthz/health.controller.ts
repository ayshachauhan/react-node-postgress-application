import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import * as AWS from 'aws-sdk';
import { HealthService } from './health.service';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  region: 'us-east-1',
});

@ApiTags('Healthz')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file,
  ) {
    console.log(file);

    s3.listBuckets().promise().then(console.log);

    await s3
      .upload({
        Bucket: 'azentia-qa',
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      })
      .promise();

    return 'ok';
  }
}
