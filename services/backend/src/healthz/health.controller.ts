import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('Healthz')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.healthService.check();
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1000000 }),
  //         new FileTypeValidator({ fileType: 'image/*' }),
  //       ],
  //     }),
  //   )
  //   file,
  // ) {
  //   console.log(file);
  //   const x = await s3
  //     .upload({
  //       Bucket: 'azentia-qa',
  //       Key: file.originalname,
  //       Body: file.buffer,
  //       ACL: 'public-read',
  //       ContentType: file.mimetype,
  //     })
  //     .promise();

  //   console.log(x, 'uploadf');
  //   const listObjectsResult = await s3
  //     .listObjectsV2({ Bucket: 'azentia-qa' }) // Replace 'qa' with your bucket name
  //     .promise();

  //   console.log(listObjectsResult, 'listObjectsResult');

  //   return 'ok';
  // }
}
