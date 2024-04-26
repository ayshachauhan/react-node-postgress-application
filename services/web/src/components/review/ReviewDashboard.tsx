'use client';
import { AddIcon } from '@components/Icons';
import { UserType } from '@packages/entities/user';
import Button from '@root/components/Button';
import { useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import AddReview from './AddReview';

const ReviewDashboard: React.FC = () => {
  //const dispatch = useAppDispatch();
  //const practices = useAppSelector((state) => state.practices.practices);
  //const [practiceId, setPracticeId] = useState<string | null>(null);
  const router = useRouter();
  const userInfo = useAppSelector(selectRecords);
  useEffect(() => {
    console.log(userInfo);
    if (userInfo && userInfo?.type === UserType.ADMIN) {
      // Perform the redirect inside the useEffect
      //router.push('dashboard');
    }
  }, [userInfo, router]);

  const isModalOpen = () => {
    console.log('modal');
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal');
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Review Management</span>
        <Button
          kind="secondary"
          title="Add Review"
          onClick={() => {}}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-12 rounded-lg w-auto">
          <div className="font-bold text-white p-4 w-auto text-center">
            Practice
          </div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            MRN
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Name
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Source
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Source
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Review Comment
          </div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            Status
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Action
          </div>
        </div>
      </div>
      <AddReview
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default ReviewDashboard;
