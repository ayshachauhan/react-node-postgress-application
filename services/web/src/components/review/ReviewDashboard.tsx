'use client';
import { ReviewStatus } from '@packages/entities/index.browser';
import Loader from '@root/components/loader';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  sendReviewRequestAsyncThunk,
} from '@root/store/reducers/review';
import { formatColumnDate, getPracticeId } from '@utils/index';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LinkBtn from '../LinkBtn/LinkBtn';

const ReviewDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const router = useRouter();
  const [reviewId, setReviewId] = useState<string | null>(null);
  const { isLoading, withLoader } = useLoader();

  const sendReqest = (id: string) => {
    setReviewId(id);
    if (practiceId && id) {
      try {
        console.log(`Request sent ${practiceId}  -  ${id}`);
        dispatch(
          sendReviewRequestAsyncThunk({
            practiceId,
            id,
          }),
        );
        setReviewId(null);
        router.push(`/post/review/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(reviewId);
    setReviewId(null);
  };

  const renderReviewStatus = (review) => {
    if (review.reviewStatus === ReviewStatus.PENDING) {
      return (
        <div className="cursor-pointer color-blue">
          <LinkBtn
            className="mt-2"
            title={'Send Request'}
            onClick={() => review.id && sendReqest(review.id)}
          >
            <span>Send Request</span>
          </LinkBtn>
        </div>
      );
    } else if (review.reviewStatus === ReviewStatus.SENT) {
      return <span>Request sent</span>;
    } else if (review.reviewStatus === ReviewStatus.RECEIVED) {
      return <span>Review received</span>;
    } else {
      return <span>No status</span>;
    }
  };

  const reviews = useAppSelector((state) =>
    Object.values(state.reviews.entities),
  );

  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.reviews.successMessage,
    errorMessage: state.reviews.errorMessage,
  }));

  useEffect(() => {
    if (practiceId !== null) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchListings({ practiceId: practiceId }));
        });
      };

      loadData();
    }
  }, [practiceId, dispatch, withLoader]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 2000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="mt-4">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Review Management</span>
      </div>
      {showModal && <div className="text-green-700">{successMessage}</div>}
      {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <table>
        <thead>
          <tr>
            <td>Practice</td>
            <td>MRN</td>
            <td>Name</td>
            <td>Source</td>
            <td className="text-center">User Rating</td>
            <td>User Comment</td>
            <td>Requested Date</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {reviews.map((data, index) => (
            <React.Fragment key={data.id}>
              <tr
                className={`${
                  index !== reviews.length - 1 ? 'border-b border-gray-300' : ''
                }`}
              >
                <td>{data?.practice?.name}</td>
                <td>{data?.patient.mrn}</td>
                <td>{data?.patient.firstName}</td>
                <td>{data?.source}</td>
                <td className="text-center">{data?.userRating}</td>
                <td>{data?.reviewComment}</td>
                <td>{formatColumnDate(new Date(data?.reviewRequestDate))}</td>
                <td>{data?.reviewStatus}</td>
                <td>{renderReviewStatus(data)}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewDashboard;
