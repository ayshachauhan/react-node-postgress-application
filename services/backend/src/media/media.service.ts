import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IEval,
  IPatient,
  IPractice,
  ISurgery,
  MediaConfigEntity,
  MediaConfigType,
} from '@packages/entities';
import { IMedia, MediaEntity, MediaType } from '@packages/entities/media';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import logger from 'src/logger';
import { PatientsService } from 'src/patients/patients.service';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UploadType } from 'src/users/types';
import { getUploadFileKey } from 'src/users/utils';
import { Repository } from 'typeorm';
import { S3Service } from '../users/s3.service';
import { CreateMediaDto, SendVideoDto } from './dtos/createMedia.dto';
import { MediaConfigDTO, UploadPatientImagesData } from './types';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(MediaConfigEntity)
    private readonly mediaConfigRepo: Repository<MediaConfigEntity>,
    @Inject(forwardRef(() => EmailHandlerService))
    private emailHandlerService: EmailHandlerService,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    private readonly s3Service: S3Service,
  ) {}

  async getMediaByPracticeId(practiceId: string) {
    return await this.media.find({
      where: { practiceId },
      relations: ['mediaConfigs'],
    });
  }

  async getMediaById(
    practiceId: string,
    mediaId: string,
  ): Promise<MediaEntity> {
    const media = await this.media.findOne({
      where: { id: mediaId, practiceId },
      relations: ['mediaConfigs'],
    });

    if (!media) {
      throw new NotFoundException(
        'Media not exists for the provided patient Id.',
      );
    }

    return media;
  }

  /**
   * @param patientId
   * @returns media for specific patient id
   */
  async getMediaByPatientId(patientId: string): Promise<MediaEntity | null> {
    const media = await this.media.findOne({
      where: { entityId: patientId },
    });

    return media;
  }

  /**
   * @param practiceId
   * @param data
   * @returns
   */
  async createOne(
    practiceId: string,
    data: CreateMediaDto,
  ): Promise<MediaEntity | null> {
    logger.info(
      `Starting the creation of new media with details: ${JSON.stringify(
        data,
      )}`,
    );
    // const mediaConfig: MediaConfig = await this.getMediaConfig(data);

    const existingMedia =
      data.mediaType === MediaType.PATIENT
        ? await this.getMediaByPatientId(data.entityId!)
        : null;

    if (existingMedia) {
      return await this.createMediaConfig(existingMedia.id, data.mediaConfig);
    } else {
      logger.info(`Creating media with details: ${JSON.stringify(data)}`);
      const media = this.media.create({
        practiceId,
        mediaType: data.mediaType,
        ...(data.entityId ? { entityId: data.entityId } : {}),
      });
      const newMedia = await this.media.save(media);
      logger.info(`Media created sucessfully with ID: ${newMedia?.id}`);

      return await this.createMediaConfig(newMedia.id, data.mediaConfig);
    }
  }

  async createMediaConfig(
    mediaId: string,
    mediaConfig: MediaConfigDTO[],
  ): Promise<MediaEntity | null> {
    logger.info(
      `Starting the creation of new media config entries for media ID: ${mediaId}`,
    );
    if (mediaConfig.length) {
      logger.info(
        `Creating ${mediaConfig.length} media config entries for media ID: ${mediaId}`,
      );
      const mediaConfigEntities: MediaConfigEntity[] = mediaConfig.map(
        (config: MediaConfigDTO) =>
          this.mediaConfigRepo.create({
            mediaId,
            configType: config.configType,
            title: config.title,
            url: config.url,
          }),
      );
      await this.mediaConfigRepo.save(mediaConfigEntities);
      logger.info(
        `Successfully created ${mediaConfig.length} media config entries for media ID: ${mediaId}`,
      );
    }
    return await this.media.findOne({
      where: {
        id: mediaId,
      },
      relations: ['mediaConfigs'],
    });
  }

  async updateMedia(
    practiceId: string,
    mediaId: string,
    videoData: Partial<MediaEntity>,
  ): Promise<MediaEntity | undefined> {
    logger.info(`Updating media with ID: ${mediaId}`);
    const media = await this.getMediaById(practiceId, mediaId);

    if (!media) {
      throw new HttpException(
        `Media with id ${mediaId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedVideo = this.media.merge(media, videoData);
    const savedVideo = this.media.save(updatedVideo);
    logger.info(`Media with ID: ${mediaId} updated successfully`);
    return savedVideo;
  }

  /**
   *
   * @param practiceId
   * @param mediaId
   */
  async deleteMedia(practiceId: string, mediaId: string): Promise<IMedia[]> {
    logger.info(`Deleting media record with ID: ${mediaId}`);
    await this.media.softDelete({ id: mediaId, practiceId });
    logger.info(`Media record with ID: ${mediaId} deleted successfully`);
    return await this.media.find({
      where: { practiceId },
      relations: ['mediaConfigs'],
    });
  }

  /**
   *
   * @param mediaId
   * @param id
   */
  async deleteMediaConfigById(
    practiceId: string,
    id: string,
  ): Promise<IMedia[]> {
    logger.info(`Deleting media config record with ID: ${id}`);
    await this.mediaConfigRepo.softDelete({ id });
    logger.info(`Media config record with ID: ${id} deleted successfully`);
    return await this.getMediaByPracticeId(practiceId);
  }

  async uploadUserImg({ id, practiceId, files }: UploadPatientImagesData) {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const key: string = getUploadFileKey(UploadType.PRACTICE, {
          practiceId,
          file,
        });

        const uploadResult = await this.s3Service.uploadFile(file, key);

        return {
          title: file.originalname.replace(/_/g, ' '),
          url: uploadResult.Location,
          configType: MediaConfigType.IMAGE,
        };
      }),
    );

    const user = await this.createMediaConfig(id, uploadResults);

    return user;
  }

  async sendVideoToPatient(
    practice: IPractice,
    payload: SendVideoDto,
  ): Promise<void> {
    const patientData: IPatient | null =
      await this.patientService.getPatientsByMrn(
        practice.id,
        Number(payload.mrn),
      );
    if (patientData) {
      const surgery: IEval | ISurgery | null = patientData.surgeries?.length
        ? patientData.surgeries[0]
        : patientData.evals?.length
          ? patientData.evals[0]
          : null;

      const data = {
        systemTemplate: SystemTemplates.SEND_VIDEO_TO_PATIENT,
        email: patientData.email,
        fname: patientData.firstName,
        lname: patientData.lastName,
        phoneNumber: patientData.phoneNumber,
        countryCode: patientData.countryCode,
        mrn: String(patientData.mrn),
        links: payload.links.join(','),
        Laterality: surgery ? surgery.bodyPart : '',
        surgery_type: surgery ? surgery.surgeryConfiguration.name : '',
      };
      await this.emailHandlerService.sendVideoToPatient(data, practice);
    }
  }
}
