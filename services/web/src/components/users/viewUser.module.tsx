import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { fetchUserInfo } from '@root/store/reducers/users';
import React, { useEffect } from 'react';

interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
}
const UserInfoPage: React.FC<ChildProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store
  const userInfo = useAppSelector((state) => state.users.userInfo);
  const userId = data.id;
  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchUserInfo({ id: userId, practiceId: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, userId, dispatch]);

  return (
    <div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Username</span>
          <span> : {userInfo.userName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Email </span>
          <span> : {userInfo.email} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Practice Name</span>
          <span> : {userInfo.userName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> Display Name</span>
          <span> : {userInfo.fullName} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold"> Designation</span>
          <span> : {userInfo.type} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">User URL </span>
          <span>: {userInfo.url} </span>
        </p>
      </div>
      <div className="space-y-4">
        <p className="mt-2">
          <span className="font-bold">Status </span>
          <span>: {userInfo.status} </span>
        </p>
      </div>
    </div>
  );
};

export default UserInfoPage;
