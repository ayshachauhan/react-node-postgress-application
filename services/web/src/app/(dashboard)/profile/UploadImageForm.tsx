import Button from '@root/components/Button';
import { ValidatedFileUploader } from '@root/components/shared/ValidatedFileUploader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { uploadImage } from '@root/store/reducers/auth';
import { UploadImgPayload } from '@root/store/requests/users';
import { allowedExtensions } from '@root/utils/constants';
import { getPracticeId, getUserId } from '@utils/index';
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
  const acceptAttribute = allowedExtensions.join(', ');

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
            <ValidatedFileUploader
              accept={acceptAttribute}
              onSuccess={(file) => {
                setUserImg(file);
                setErrorMessage('');
              }}
              onError={setErrorMessage}
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
