'use client';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import FiltersSection from '@root/components/dashboard/FiltersSection';
import SurgeryPercentage from '@root/components/dashboard/SurgeryPercentage';
import UpcomingSection from '@root/components/dashboard/UpcomingSection';
import UsersListing from '@root/components/dashboard/UsersListing';
import AddSurgeryModal from '@root/components/dashboard/addSurgeryModal';
import AddEvalModal from '@root/components/eval/addEval/addEvalModal';
import Loader from '@root/components/loader';
import { useLoader } from '@root/hooks/useLoader';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import {
  clearSuccessMessage as clearEvalSuccessMessage,
  fetchListings as fetchEvalsList,
} from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import {
  clearSuccessMessage as clearSurgerySuccessMessage,
  fetchListings as fetchSurgeryList,
} from '@root/store/reducers/surgery';
import { fetchListings as fetchSurgeryConfigurationsListing } from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import { fetchListings as fetchWaitlist } from '@root/store/reducers/waitlist';
import { getPracticeId, getUserId } from '@root/utils';
import React, { useEffect, useState } from 'react';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const userId: string | null = getUserId();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;
  const loggedInUserId = userInfo?.id ?? null;
  const { selectedMonth, searchMRNName, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEvalModalOpen, setIsAddEvalModalOpen] = useState(false);

  const addCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.ADD_CASE,
  ]);

  const viewUserMetrics = useUserPermission(userPermissions, [
    USER_PERMISSIONS.LEADERBOARD_DISPLAY,
  ]);

  const { successMessage: addSurgerySuccessMessage, calendarSuccessMessage } =
    useAppSelector((state) => ({
      successMessage: state.surgeries.successMessage,
      errorMessage: state.surgeries.errorMessage,
      calendarSuccessMessage: state.calendars.successMessage,
    }));
  const { successMessage: addEvalSuccessMessage } = useAppSelector((state) => ({
    successMessage: state.evals.successMessage,
    errorMessage: state.evals.errorMessage,
  }));
  const [showModal, setShowModal] = useState(false);
  const selectedValueStr = selectedValue || '';
  const monthLabels = selectedMonth.map((month) => month.label);
  const month = monthLabels.join(',');
  const searchMRNNameStr = searchMRNName || '';
  const { isLoading, withLoader } = useLoader();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchEvalsList({ practiceId }));
          if (loggedInUserId !== null) {
            await dispatch(
              fetchSurgeryList({
                loggedInUserId,
                practiceId,
                month: month,
                searchMRNName: searchMRNNameStr,
                option: selectedValueStr,
              }),
            );
          }
          await dispatch(fetchInsuranceTypesList({ practiceId }));
          await dispatch(fetchPracticeHomesListing({ practiceId }));
          await dispatch(fetchSurgeryTypesListing({ practiceId }));
          await dispatch(fetchReferrerList({ practiceId }));
          await dispatch(fetchUsersList({ practiceId }));
          await dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
          await dispatch(fetchPatients({ practiceId }));
          await dispatch(fetchWaitlist({ practiceId }));
        });
      };
      loadData();
    }
  }, [practiceId, dispatch, withLoader]);

  useEffect(() => {
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      if (practiceId) {
        const loadData = async () => {
          await withLoader(async () => {
            if (loggedInUserId !== null) {
              await dispatch(
                fetchSurgeryList({
                  loggedInUserId,
                  practiceId,
                  month: month,
                  searchMRNName: searchMRNNameStr,
                  option: selectedValueStr,
                }),
              );
            }
            await dispatch(fetchEvalsList({ practiceId }));
            await dispatch(clearSurgerySuccessMessage());
            await dispatch(clearEvalSuccessMessage());
            await dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
            await dispatch(fetchWaitlist({ practiceId }));
            await dispatch(fetchPatients({ practiceId }));
            if (userId && loggedInUserId !== null) {
              await dispatch(
                fetchFilteredCalendars({
                  practiceId,
                  userId,
                  month,
                  option: selectedValueStr,
                  loggedInUserId,
                }),
              );
            }
          });
        };
        loadData();
      }
    }
  }, [
    addSurgerySuccessMessage,
    addEvalSuccessMessage,
    calendarSuccessMessage,
    dispatch,
    practiceId,
    userId,
    withLoader,
  ]);

  useEffect(() => {
    let timer;
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSurgerySuccessMessage());
        dispatch(clearEvalSuccessMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [addSurgerySuccessMessage, addEvalSuccessMessage, dispatch]);

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddEvalModal = (): void => {
    setIsAddEvalModalOpen(false);
  };

  const handleOpenAddEvalModal = (): void => {
    setIsAddEvalModalOpen(true);
  };

  return (
    <div id="__next" className="">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400 items-center">
        <span className="text-xl font-bold">Dashboard </span>
        {showModal && (
          <div className="text-green-700">
            {addSurgerySuccessMessage
              ? addSurgerySuccessMessage
              : addEvalSuccessMessage}
          </div>
        )}
        <div className="flex  justify-between">
          <div className="flex">
            {addCaseAllowed && (
              <div className="flex gap-2">
                <Button
                  kind="secondary"
                  title="Eval"
                  height={32}
                  width={75}
                  fontSize="12px"
                  onClick={handleOpenAddEvalModal}
                  startEnhancer={() => (
                    <AddIcon className="mt-2 " size={25}></AddIcon>
                  )}
                />
                <Button
                  kind="secondary"
                  title="Surgery"
                  height={32}
                  width={85}
                  fontSize="12px"
                  padding="2px"
                  onClick={handleOpenAddModal}
                  startEnhancer={() => (
                    <AddIcon className="mt-2" size={25}></AddIcon>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="h-px my-1 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="mt-1">
        <div className="flex gap-4">
          <div className="w-7/12 border border-solid rounded-lg px-2.5 py-2">
            <UpcomingSection />
          </div>
          {viewUserMetrics && (
            <div className="w-2/12 border border-solid rounded-lg px-2.5 py-2 text-lg">
              <UsersListing />
            </div>
          )}
          <div className="w-3/12 border border-solid rounded-lg px-2.5 py-2 text-lg">
            <SurgeryPercentage />
          </div>
        </div>
      </div>
      <div className="mt-2 mb-12">
        {practiceId && (
          <FiltersSection practiceId={practiceId} withLoader={withLoader} />
        )}
      </div>
      <AddSurgeryModal
        isModalOpen={isAddModalOpen}
        handleCloseModal={handleCloseAddModal}
        withLoader={withLoader}
      />
      <div className="w-400">
        <AddEvalModal
          isSecondModalOpen={isAddEvalModalOpen}
          handleCloseSecondModal={handleCloseAddEvalModal}
          withLoader={withLoader}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
