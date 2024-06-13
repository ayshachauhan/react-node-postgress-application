import Button from '@root/components/Button';
import { useAppDispatch, useAppSelector } from '@root/store';
import { uploadImage } from '@root/store/reducers/auth';
import { UploadImgPayload } from '@root/store/requests/users';
import { getPracticeId, getUserId } from '@utils/index';
import { FileUploader } from 'baseui/file-uploader';
import React, { useState } from 'react';
const UploadImageForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [userImg, setUserImg] = useState<File | null>(null);
  const practiceId = getPracticeId();
  const userId = getUserId();
  const userInfo = useAppSelector((state) => state.auth.user);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && userId && userImg) {
      const data: UploadImgPayload = {
        practiceId,
        id: userInfo?.id ?? userId,
        file: userImg,
      };
      try {
        dispatch(uploadImage(data));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="justify-between pt-4">
          <div className="">
            <label htmlFor="adminEmail" className="text-black text-sm">
              User Photo
            </label>
            <FileUploader
              errorMessage={''}
              onDrop={(acceptedFiles: File[]) => {
                setUserImg(acceptedFiles[0]);
              }}
              onDropRejected={(file: File[]) => {
                if (!file[0].type.startsWith('image'))
                  setErrorMessage('Only Image type Files are allowed.');
              }}
              accept="image/*"
              overrides={{
                ContentMessage: {
                  component: () => (
                    <div>
                      {userImg ? (
                        <div>
                          <p>{userImg?.name}</p>
                        </div>
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
                    color: '##F0FDF4',
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Upload" width={189} />
        </div>
      </form>
    </div>
  );
};

export default UploadImageForm;
