import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@packages/entities/media';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MediaConfigDTO } from '../types';

export class CreateMediaDto {
  @IsNotEmpty({ message: 'Media Type is required' })
  @ApiProperty()
  mediaType: MediaType;

  @IsNotEmpty({ message: 'Media Config type is required' })
  @ApiProperty()
  mediaConfig: MediaConfigDTO[];

  @IsOptional()
  entityId: string | null;
}

export class SendVideoDto {
  @IsNotEmpty({ message: 'Media Type is required' })
  @ApiProperty()
  mrn: string;

  @IsNotEmpty({ message: 'Media Config type is required' })
  @ApiProperty()
  links: string[];
}
