'use client';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  postReviewAsyncThunk,
  validateReviewRequestAsyncThunk,
} from '@root/store/reducers/review';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Radio, RadioGroup } from 'baseui/radio';
import { Textarea } from 'baseui/textarea';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LogoWrapper } from '../LogoWrapper/logoWrapper';

const PostReview: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = usePathname();
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [validReviewReq, setValidReviewReq] = useState(false);
  const [userReviewSubmitted, setUserReviewSubmitted] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.reviews.successMessage,
    errorMessage: state.reviews.errorMessage,
  }));
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fullPath = router;
  const [basePath] = fullPath.split('?');
  const pathSegments = basePath.split('/').filter((segment) => segment);
  const practiceId = pathSegments.length >= 2 ? pathSegments[2] : '';
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get('r');

  useEffect(() => {
    const validateReview = async () => {
      if (token) {
        const validReview = await dispatch(
          validateReviewRequestAsyncThunk({
            practiceId,
            token,
          }),
        );

        if (validReview.meta?.requestStatus === 'rejected') {
          setValidReviewReq(false);
        } else {
          setValidReviewReq(true);
        }
        console.log('valid review: ', validReview);
      }
    };
    validateReview();
    setUserReviewSubmitted(false);
  }, [practiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validReviewReq && review) {
      const userReviewResponse = await dispatch(
        postReviewAsyncThunk({
          practiceId,
          token: token ?? '',
          rating,
          reviewComment: review,
        }),
      );
      if (
        userReviewResponse &&
        userReviewResponse.meta?.requestStatus !== 'rejected'
      ) {
        console.log('User review posted', userReviewResponse);
        setUserReviewSubmitted(true);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 5000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage]);

  return (
    <LogoWrapper>
      <div className="mt-11 mx-11">
        {userReviewSubmitted ? (
          <span>Thank you for providing your review.</span>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl label="Please rate us">
              <RadioGroup
                value={rating}
                onChange={(e) =>
                  setRating((e.target as HTMLInputElement).value)
                }
                align="horizontal"
              >
                <Radio value="5">5</Radio>
                <Radio value="4">4</Radio>
                <Radio value="3">3</Radio>
                <Radio value="2">2</Radio>
                <Radio value="1">1</Radio>
              </RadioGroup>
            </FormControl>
            <FormControl label="Put your comments here">
              <Textarea
                value={review}
                onChange={(e) =>
                  setReview((e.target as HTMLTextAreaElement).value)
                }
                required
              />
            </FormControl>
            <Button
              type="submit"
              overrides={{ BaseButton: { style: { width: '100%' } } }}
            >
              Post Review
            </Button>
          </form>
        )}
        {(errorMessage || showErrorMessage) && (
          <div className="text-red-700">{errorMessage}</div>
        )}
      </div>
    </LogoWrapper>
  );
};
export default PostReview;
