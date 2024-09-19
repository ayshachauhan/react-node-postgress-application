import { useAppSelector } from '@root/store';
import { SanitizedUser } from '@root/store/types';
import React from 'react';

interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
}
const UserInfoPage: React.FC<ChildProps> = ({ data }) => {
  const userInfo = useAppSelector((state) =>
    data.id
      ? Object.values(state.users.entities).find(
          ({ id }: SanitizedUser) => id === data.id,
        )
      : undefined,
  );

  return (
    <div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Username</span>
          <span> : {userInfo?.userName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Email </span>
          <span> : {userInfo?.email} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Practice Name</span>
          <span> : {userInfo?.userName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> Display Name</span>
          <span> : {userInfo?.fullName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> Contact Number</span>
          <span>
            {' '}
            :{userInfo?.countryCode} {userInfo?.contactNumber}{' '}
          </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> Designation</span>
          <span> : {userInfo?.designation} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> User Type</span>
          <span> : {userInfo?.type} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">User URL </span>
          <span>: {userInfo?.url} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Status </span>
          <span>: {userInfo?.status} </span>
        </p>
      </div>
    </div>
  );
};

export default UserInfoPage;
