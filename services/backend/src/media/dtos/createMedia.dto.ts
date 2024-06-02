import { ApiProperty } from '@nestjs/swagger';
import { MediaConfig, MediaType } from '@packages/entities/media';
import { IsNotEmpty } from 'class-validator';

// export type PracticeMediaConfigDTO = {
//   surgeryConfigurationId: string;
//   video: Video[];
// };

// export type PatientMediaConfigDTO = {
//   patientId: string;
//   video: Video[];
//   image: Image[];
// };

export class CreateMediaDto {
  @IsNotEmpty({ message: 'Media Type is required' })
  @ApiProperty()
  mediaType: MediaType;

  @IsNotEmpty({ message: 'Media Config is required' })
  @ApiProperty()
  mediaConfig: MediaConfig;
}
