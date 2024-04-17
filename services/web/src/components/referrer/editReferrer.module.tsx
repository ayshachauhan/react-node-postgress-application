'use client';
import { IReferrer } from '@packages/entities';
import { ReferrerType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/referrer';
import { EditReferrer } from '@root/store/requests/referrers';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';

interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}
const EditReferrerForm: React.FC<ChildProps> = ({ data, onClose }) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const referrerTypeOptions = Object.keys(ReferrerType).map((key) => ({
    label: ReferrerType[key as keyof typeof ReferrerType],
    id: key,
  }));
  const referrerId = data.id;

  const [updatedReferrerInfo, setReferrerInfo] = useState<
    Partial<EditReferrer>
  >({});

  const handlereferrerTypeChange = (params) => {
    const { label } = params.option;
    setReferrerInfo({ ...updatedReferrerInfo, referrerType: label });
  };

  const referrerInfo = useAppSelector((state) =>
    data.id
      ? Object.values(state.referrers.entities).find(
          ({ id }: IReferrer) => id === data.id,
        )
      : undefined,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && referrerId) {
      const referrerPayloadData = {
        ...updatedReferrerInfo,
        firstName: updatedReferrerInfo.firstName ?? '',
        lastName: updatedReferrerInfo.lastName ?? '',
        email: updatedReferrerInfo.email ?? '',
        referrerType: updatedReferrerInfo.referrerType ?? ReferrerType.PCP,
        practiceId: practiceId,
        id: referrerId,
      };
      try {
        dispatch(updateRecordAsync(referrerPayloadData));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (data.id && referrerInfo) {
      setReferrerInfo(referrerInfo);
    }
  }, [data.id, referrerInfo]);

  return (
    <>
      <div className="border-gray-400">
        <form onSubmit={handleSubmit}>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-black text-sm font-normal"
              >
                First Name
              </label>
              <TextInput
                name="firstName"
                value={updatedReferrerInfo?.firstName || ''}
                onChange={(value) => {
                  setReferrerInfo({ ...updatedReferrerInfo, firstName: value });
                }}
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-black text-sm font-normal"
              >
                Last Name
              </label>
              <TextInput
                name="lastName"
                value={updatedReferrerInfo?.lastName || ''}
                onChange={(value) => {
                  setReferrerInfo({ ...updatedReferrerInfo, lastName: value });
                }}
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="referrerType"
                className="text-black text-sm font-normal"
              >
                Referrer Type
              </label>
              <Select
                options={referrerTypeOptions}
                onChange={handlereferrerTypeChange}
                value={
                  updatedReferrerInfo?.referrerType
                    ? [
                        {
                          label: updatedReferrerInfo.referrerType,
                          id: updatedReferrerInfo.referrerType,
                        },
                      ]
                    : []
                }
                required
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
                Email
              </label>
              <TextInput
                name="email"
                value={updatedReferrerInfo?.email || ''}
                onChange={(value) => {
                  setReferrerInfo({ ...updatedReferrerInfo, email: value });
                }}
              />
            </div>
          </div>
          <div className="text-right text-base pt-4">
            <Button kind="primary" title="Update Referrer" width={189} />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReferrerForm;
