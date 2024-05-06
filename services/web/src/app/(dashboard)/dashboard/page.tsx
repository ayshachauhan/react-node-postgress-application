'use client';
import {
  IInsuranceType,
  IPracticeHomes,
  IReferrer,
  ISurgery,
  ISurgeryConfiguration,
} from '@packages/entities';
import { ISurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon, EditIcon } from '@root/components/Icons';
import Form from '@root/components/dashboard/addSurgery.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearSuccessMessage as clearEvalSuccessMessage,
  fetchListings as fetchEvalsList,
} from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import {
  clearSuccessMessage as clearSurgerySuccessMessage,
  fetchListings as fetchSurgeryList,
} from '@root/store/reducers/surgery';
import { fetchListings as fetchSurgeryConfigurationsListing } from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import { getPracticeId, toFullName, usDateFormatter } from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';

import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const { successMessage: addSurgerySuccessMessage } = useAppSelector(
    (state) => ({
      successMessage: state.surgeries.successMessage,
      errorMessage: state.surgeries.errorMessage,
    }),
  );

  const surgeryOptionsHeaders: string[] = [];
  const checkListHeaders: string[] = [];
  const { successMessage: addEvalSuccessMessage } = useAppSelector((state) => ({
    successMessage: state.evals.successMessage,
    errorMessage: state.evals.errorMessage,
  }));

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (practiceId) {
      dispatch(fetchEvalsList({ practiceId }));
      dispatch(fetchSurgeryList({ practiceId }));
      dispatch(fetchInsuranceTypesList({ practiceId }));
      dispatch(fetchPracticeHomesListing({ practiceId }));
      dispatch(fetchSurgeryTypesListing({ practiceId }));
      dispatch(fetchReferrerList({ practiceId }));
      dispatch(fetchUsersList({ practiceId }));
      dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      if (practiceId) {
        dispatch(fetchEvalsList({ practiceId }));
        dispatch(fetchSurgeryList({ practiceId }));
        dispatch(clearSurgerySuccessMessage());
        dispatch(clearEvalSuccessMessage());
      }
    }
  }, [addSurgerySuccessMessage, addEvalSuccessMessage, dispatch]);

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

  const practiceHomesList: IPracticeHomes[] = useAppSelector((state) =>
    Object.values(state.practiceHomes.entities),
  );

  const surgeryTypesList: ISurgeryType[] = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const insuranceTypesList: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );

  const referrersList: IReferrer[] = useAppSelector((state) =>
    Object.values(state.referrers.entities),
  );

  const usersList: SanitizedUser[] = useAppSelector((state) =>
    Object.values(state.users.entities),
  );

  const surgeryList: ISurgery[] = useAppSelector((state) =>
    Object.values(state.surgeries.entities),
  );

  const surgeryConfigList: ISurgeryConfiguration[] = useAppSelector((state) =>
    Object.values(state.surgeryConfigurations.entities),
  );
  if (surgeryConfigList.length) {
    const tempArr: string[] = [];
    const checkListArr: string[] = [];
    surgeryConfigList.forEach((ele) => {
      tempArr.push(...Object.keys(ele.options));
      checkListArr.push(...Object.keys(ele.checkList));
    });
    surgeryOptionsHeaders.push(...new Set(tempArr));
    checkListHeaders.push(...new Set(checkListArr));
  }

  const modifyEvalList = surgeryList
    .map((ele, index) => {
      const surgeryConfigOptions = ele.surgeryConfiguration.options;
      const checkListArr = Object.keys(ele.surgeryConfiguration.checkList);

      const viewData = {
        hospitalPricing: 0,
        professionalPricing: 0,
        totalPrice: 0,
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        fullName: toFullName(ele?.patient),
        mrn: ele.patient.mrn,
        email: ele.patient.email,
        phoneNumber: ele.patient.phoneNumber,
        date: usDateFormatter(ele.date),
        surgeryTypeName: ele.surgeryConfiguration.name,
        practiceHomeName: ele.practiceHome.name,
        insuranceDetails: ele.insuranceDetails,
        insuranceTypeName: ele.insuranceType ? ele.insuranceType?.name : '',
        pcp: '',
        referrer: ele.patient.referrer ? ele.patient.referrer.email : '',
        details: ele.patient.details ? ele.patient.details : '',
        eye: ele.eye,
        index: index + 1,
        id: ele.id,
      };
      ele.surgeryOption.forEach((ele) => {
        const optionDetails = surgeryConfigOptions[ele];
        const allowedValue = optionDetails.allowedValues[0];
        viewData[optionDetails.label] = allowedValue.name;
        viewData.hospitalPricing += +allowedValue.hospitalPricing;
        viewData.professionalPricing += +allowedValue.professionalPricing;
      });
      checkListArr.forEach((ele) => (viewData[ele] = ele));

      viewData.totalPrice =
        viewData.hospitalPricing + viewData.professionalPricing;

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const FormModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: () => ({
              width: '1300px',
              maxWidth: '90%',
            }),
          },
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalBody>
          <Form
            onClose={handleCloseAddModal}
            items={{
              practiceHomesList,
              surgeryTypesList,
              insuranceTypesList,
              referrersList,
              usersList,
            }}
          />
        </ModalBody>
      </Modal>
    );
  };
  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Dashboard </span>
        <div className="flex justify-between">
          {showModal && (
            <div className="text-green-700">
              {addSurgerySuccessMessage
                ? addSurgerySuccessMessage
                : addEvalSuccessMessage}
            </div>
          )}
          <div className="flex ml-5"></div>
          <Button
            kind="secondary"
            title="Add New"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
          />{' '}
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div
          className={`bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-lg`}
        >
          <div className="font-bold text-white p-4 w-20">Date</div>
          <div className="font-bold text-white p-4 w-40">Name</div>
          <div className="font-bold text-white p-4 w-30">MRN</div>
          <div className="font-bold text-white p-4 w-20">Eye</div>
          <div className="font-bold text-white p-4 w-30">Surgery</div>
          {surgeryOptionsHeaders.length
            ? surgeryOptionsHeaders.map((ele, index) => (
                <div
                  className="font-bold text-white p-4 text-center w-40"
                  key={index}
                >
                  {ele}
                </div>
              ))
            : null}
          <div className="font-bold text-white p-4 w-20">Hosp($)</div>
          <div className="font-bold text-white p-4 w-20">Prof($)</div>
          <div className="font-bold text-white p-4 w-20">Total($)</div>
          {checkListHeaders.length &&
            checkListHeaders.map((ele, index) => (
              <div
                className="font-bold text-white p-4 w-20 text-center"
                key={index}
              >
                {ele}
              </div>
            ))}
          <div className="font-bold text-white p-4 w-20">Action</div>
        </div>
        <div className="">
          {modifyEvalList.map((data) => (
            <React.Fragment key={data.id}>
              <div className="flex">
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.date}
                </div>
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-40">
                  {data.fullName}
                </div>

                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.mrn}
                </div>
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.eye}
                </div>
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-30">
                  {data.surgeryTypeName}
                </div>
                {surgeryOptionsHeaders.length &&
                  surgeryOptionsHeaders.map((ele, i) => (
                    <div
                      className="text-gray-900 bg-gray-50 pt-2 px-4 w-40 text-center"
                      key={i}
                    >
                      {data[ele]}
                    </div>
                  ))}
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.hospitalPricing}
                </div>
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.professionalPricing}
                </div>
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20">
                  {data.totalPrice}
                </div>
                {checkListHeaders.length &&
                  checkListHeaders.map((ele, i) => (
                    <div
                      className="text-gray-900 bg-gray-50 pt-2 px-4 w-20"
                      key={i}
                    >
                      {data[ele]}
                    </div>
                  ))}
                <div className="text-gray-900 bg-gray-50 pt-2 px-4 w-20 flex gap-4">
                  <div className="cursor-pointer">
                    <EditIcon className="mt-2"></EditIcon>
                  </div>
                  <div className="cursor-pointer">
                    <DeleteIcon className="mt-2"></DeleteIcon>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div></div>
      </div>
      <FormModal />
    </div>
  );
};

export default Dashboard;
