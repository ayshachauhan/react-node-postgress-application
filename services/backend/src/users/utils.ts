import { GetUploadFileKey, UploadType } from './types';

export const getUploadFileKey = (
  uploadType: UploadType,
  data: GetUploadFileKey,
): string => {
  const timestamp = Date.now();
  switch (uploadType) {
    case UploadType.USER:
      return `upload/practice/${data.practiceId}/user/${data.userId}/${data.file.originalname}`;
    case UploadType.PRACTICE:
      return `upload/practice/${data.practiceId}/${data.file.originalname}${timestamp}`;
    case UploadType.TEMPLATES:
      return `upload/templates/${data.practiceId}/templates/${data.templateId}/${data.file.originalname}`;
  }
};

export const getUploadFileUrl = (bucketName: string, key: string) =>
  `https://${bucketName}.s3.amazonaws.com/${key}`;
