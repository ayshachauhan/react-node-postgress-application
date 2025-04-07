import { FileUploader } from 'baseui/file-uploader';
import React, { useState } from 'react';
import {
  validateFileSignature,
  validateFileSize,
  validateFileType,
} from 'src/utils/index';

interface Props {
  onSuccess: (file: File) => void;
  onError?: (message: string) => void;
  accept: string;
  defaultFile?: File | null;
}

export const ValidatedFileUploader: React.FC<Props> = ({
  onSuccess,
  onError,
  accept,
  defaultFile = null,
}) => {
  const [currentFile, setCurrentFile] = useState<File | null>(defaultFile);

  const handleFile = (file: File) => {
    const typeError = validateFileType(file);
    if (typeError) {
      onError?.(typeError);
      return;
    }

    const sizeError = validateFileSize(file);
    if (sizeError) {
      onError?.(sizeError);
      return;
    }

    validateFileSignature(
      file,
      (validatedFile) => {
        onError?.('');
        setCurrentFile(validatedFile);
        onSuccess(validatedFile);
      },
      (signatureError) => {
        onError?.(signatureError);
        setCurrentFile(null);
      },
    );
  };

  return (
    <FileUploader
      errorMessage={undefined} // we’re not showing local errors here
      onDrop={(acceptedFiles: File[]) => {
        if (!acceptedFiles || acceptedFiles.length === 0) {
          onError?.('No file uploaded.');
          return;
        }
        handleFile(acceptedFiles[0]);
      }}
      onDropRejected={() => {
        onError?.('Invalid file type or size.');
      }}
      accept={accept}
      overrides={{
        ContentMessage: {
          component: () => (
            <div>
              {currentFile ? (
                <p>{currentFile.name}</p>
              ) : (
                <span>Drag and drop or click to upload</span>
              )}
            </div>
          ),
        },
        FileDragAndDrop: {
          style: {
            marginBottom: '16px',
            borderColor: '#22C55E',
            color: '#F0FDF4',
          },
        },
      }}
    />
  );
};
