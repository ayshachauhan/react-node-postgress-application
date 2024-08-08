'use client';
import { ISurgery, UserType } from '@packages/entities';
import { State, useAppDispatch, useAppSelector } from '@root/store';
import { fetchAllSurgeries } from '@root/store/reducers/surgery';
import { getPracticeId } from '@root/utils';
import React, { useEffect } from 'react';

const UsersListing: React.FC = () => {
  const { entities } = useAppSelector((state: State) => state.users);
  let userData = Object.values(entities).filter(
    (user) => user.type == UserType.DOCTOR,
  );
  const { surgeryList } = useAppSelector((state) => ({
    surgeryList: Object.values(state.surgeries.allSurgeries) as ISurgery[],
  }));
  const { userInfo } = useAppSelector((state) => ({
    userInfo: state.auth.user,
  }));

  const loggedInUserId = userInfo?.id;
  if (userInfo?.type === UserType.DOCTOR) {
    userData = Object.values(entities).filter(
      (user) => user.id === loggedInUserId,
    );
  }

  const doctorsWithSurgeries = userData.map((doctor) => {
    const doctorSurgeries = surgeryList.filter(
      (surgery) => surgery.doctor.id === doctor.id,
    );
    return { ...doctor, surgeries: doctorSurgeries };
  });
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (practiceId) {
      dispatch(fetchAllSurgeries({ practiceId }));
    }
  }, [practiceId, dispatch]);

  return (
    <div>
      <div className="text-lg font-normal">
        Users
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs">
        <table className="w-full">
          <thead className="">
            <th className="">User</th>
            <th className="text-center">Day</th>
            <th className="text-center">Month</th>
          </thead>
          <tbody>
            {doctorsWithSurgeries.map((user, index) => (
              <React.Fragment key={user.id}>
                <tr
                  className={`${
                    index !== doctorsWithSurgeries.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <td className="">{user?.firstName}</td>
                  <td className="text-center">
                    {user.surgeries?.filter((surgery) => {
                      const surgeryDate = new Date(surgery.date);
                      const currentDate = new Date();
                      return surgeryDate.getDate() === currentDate.getDate();
                    }).length || 0}
                  </td>
                  <td className="text-center">{user.surgeries.length || 0}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersListing;
