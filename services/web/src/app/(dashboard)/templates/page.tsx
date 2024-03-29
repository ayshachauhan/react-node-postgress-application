'use client';
import Button from '@root/components/Button';
import { AddIcon, SearchIcon } from '@root/components/Icons';
import Form from '@root/components/templates/addTemplate.module';
import TemplateUpdate from '@root/components/templates/updateTemplate.module';
import { UserType } from '@root/enums/userType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice, selectRecords } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/templates';
import { Input } from 'baseui/input';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import { Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Templates: React.FC = () => {
  const inputOverrides = {
    Input: {
      style: () => ({
        backgroundColor: 'ffffff',
        height: '34px',
        boxShadow: 'none',
      }),
    },
    Root: {
      style: {
        border: 'none',
      },
    },
  };

  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [surgeryType, setSurgeryType] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const practiceId = useAppSelector(selectPractice);
  const templates = useAppSelector((state) => state.templates.template);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();
  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryType(value[0] ? value[0].label : null);
  };
  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const handleOpenUpdateModal = (): void => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = (): void => {
    setIsUpdateModalOpen(false);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };
  const userInfo = useAppSelector(selectRecords);

  useEffect(() => {
    if (userInfo && userInfo?.type !== UserType.ADMIN) {
      // Perform the redirect inside the useEffect
      router.push('practices');
    }
  }, [userInfo, router]);

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
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          Add New Template
        </ModalHeader>
        <ModalBody>
          <Form onClose={handleCloseAddModal} />
        </ModalBody>
      </Modal>
    );
  };

  const TemplateUpdateModal = () => {
    return (
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: () => ({
              width: '1300px',
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
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          <div className="flex justify-between mt-10 items-center">
            <p>Write New Template</p>
            <div className="flex items-center gap-5">
              <div className="flex flex-row items-center gap-2">
                <label
                  htmlFor="surgeryType"
                  className="text-black text-sm font-normal"
                >
                  Surgery:
                </label>
                <div
                  style={{ fontSize: '14px', fontWeight: 400, width: '180px' }}
                >
                  <Select
                    options={[
                      { label: 'cataract', id: '1' },
                      { label: 'yag', id: '2' },
                      { label: 'lasik', id: '3' },
                    ]}
                    onChange={handleSurgeryTypeChange}
                    value={
                      surgeryType
                        ? [{ label: surgeryType, id: surgeryType }]
                        : []
                    }
                    required
                    overrides={{
                      ControlContainer: {
                        style: {
                          backgroundColor: 'rgba(250, 250, 250, 1)',
                          border: 'none',
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
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <TemplateUpdate onClose={handleCloseUpdateModal} />
        </ModalBody>
      </Modal>
    );
  };
  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId, userId: userInfo?.id }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
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

  const errorMessage1: string = 'Error occurred while adding record.';
  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-2xl font-medium">Template Engine </span>
        <div style={{ color: 'green' }}>{successMessage}</div>
        {showErrorMessage && (
          <div style={{ color: 'red' }}>{errorMessage1}</div>
        )}
        <div className="flex justify-between">
          <div className="flex ml-5 pr-1">
            <div style={{ width: '291px' }}>
              <div className="rounded-tl rounded-tr-none rounded-bl rounded-br-none border border-gray-300 border-r-0">
                <Input
                  name="search"
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search Surgery"
                  overrides={inputOverrides}
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-light to-primary-dark w-14 h-9 rounded-r-lg flex items-center justify-center text-white border-none">
              <SearchIcon></SearchIcon>
            </div>
          </div>
          <Button
            kind="secondary"
            title="Add New"
            width={104}
            height={38}
            padding="8px 10px 8px 10px"
            fontSize="14px"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={18}></AddIcon>}
          />
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="flex flex-wrap gap-7">
        <div className="rounded-lg shadow-md w-[370px] h-292 relative">
          {templates.map((data) => (
            <React.Fragment key={data.id}>
              <div className="text-white py-2.5 text-center bg-gradient-to-r from-primary-light to-primary-dark uppercase rounded-t-lg font-bold">
                {data.surgeryType}
              </div>
              <div className="rounded-lg" style={{ height: '245px' }}>
                <div className="grid grid-rows-5 h-full p-2">
                  <div className="row-start-1 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Booking: </span>{' '}
                      <span
                        className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white cursor-pointer"
                        onClick={handleOpenUpdateModal}
                      >
                        Booking
                      </span>
                    </p>
                  </div>
                  <div className="row-start-2 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Referrer: </span>
                      {['V1', 'V2', 'V3', 'V4', 'V5'].map((ele, i) => (
                        <span
                          key={i}
                          className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1"
                        >
                          {ele}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="row-start-3 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Referrer: </span>
                      {['V1', 'V2', 'V3', 'V4', 'V5'].map((ele, i) => (
                        <span
                          key={i}
                          className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1"
                        >
                          {ele}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="row-start-4 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Referrer: </span>
                      {['-1', '-3', '-5', '-7', '-9'].map((ele, i) => (
                        <span
                          key={i}
                          className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1"
                        >
                          {ele}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="row-start-5 row-span flex items-center border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Referrer: </span>
                      {['1', '3', '5', '7', '9'].map((ele, i) => (
                        <span
                          key={i}
                          className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1"
                        >
                          {ele}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <FormModal />
      <TemplateUpdateModal />
    </div>
  );
};

export default Templates;
