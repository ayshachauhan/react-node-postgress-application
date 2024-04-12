'use client';
import { UserType } from '@packages/entities';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/templates/addTemplate.module';
import TemplateUpdate from '@root/components/templates/updateTemplate.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice, selectRecords } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/templates';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
const Templates: React.FC = () => {
  const templates = useAppSelector((state) => state.templates.templates);
  const dispatch = useAppDispatch();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string | null>(null);
  const [versionOffset, setVersionOffset] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const practiceId = useAppSelector(selectPractice);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();
  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const handleOpenUpdateModal = (
    Id: string,
    MessageType: string,
    versionOffset: string | null,
  ): void => {
    setIsUpdateModalOpen(true);
    setTemplateId(Id);
    setMessageType(MessageType);
    setVersionOffset(versionOffset);
  };

  const handleCloseUpdateModal = (): void => {
    setIsUpdateModalOpen(false);
    setTemplateId(null);
    setMessageType(null);
    setVersionOffset(null);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };
  const userInfo = useAppSelector(selectRecords);
  const userId = userInfo?.id;
  useEffect(() => {
    if (userInfo && userInfo?.type !== UserType.ADMIN) {
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
        <ModalBody>
          {templateId !== null &&
            messageType !== null &&
            versionOffset !== null && (
              <TemplateUpdate
                data={{
                  id: templateId,
                  messageType: messageType,
                  versionOffset: versionOffset,
                }}
                onClose={handleCloseUpdateModal}
              />
            )}
        </ModalBody>
      </Modal>
    );
  };
  useEffect(() => {
    if (practiceId !== null && userId !== null) {
      const formattedPracticeId = practiceId ?? '';
      const formattedUserId = userId ?? '';
      dispatch(
        fetchListings({
          practiceId: formattedPracticeId,
          userId: formattedUserId,
        }),
      );
    }
  }, [practiceId, userId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      if (practiceId !== null && userId !== null) {
        dispatch(
          fetchListings({
            practiceId,
            userId,
          }),
        );
      }
    }
  }, [successMessage, dispatch]);

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

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-2xl font-medium">Template Engine </span>
        <div className="text-green-700">{successMessage}</div>
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <div className="flex w-2/6 justify-between">
          <div className="flex ml-5"></div>
          <Button
            kind="secondary"
            title="Add New"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
          />
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="flex flex-wrap gap-7">
        {templates.map((data, i) => (
          <React.Fragment key={i}>
            <div className="rounded-lg shadow-md w-[370px] h-292 relative">
              <div className="text-white py-2.5 text-center bg-gradient-to-r from-primary-light to-primary-dark uppercase rounded-t-lg font-bold">
                {data.surgeryType}
              </div>
              <div className="rounded-lg" style={{ height: '245px' }}>
                <div className="grid grid-rows-5 h-full p-2">
                  <div className="row-start-1 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Booking: </span>{' '}
                      {data.booking &&
                        data.booking.map((ele, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              ele.id &&
                              handleOpenUpdateModal(
                                ele.id,
                                ele.messageType,
                                ele.version,
                              )
                            }
                            className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1 cursor-pointer"
                          >
                            {ele.version}
                          </span>
                        ))}
                    </p>
                  </div>
                  <div className="row-start-2 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Referrer: </span>
                      {data.referrer &&
                        data.referrer.map((ele, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              ele.id &&
                              handleOpenUpdateModal(
                                ele.id,
                                ele.messageType,
                                ele.version,
                              )
                            }
                            className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1 cursor-pointer"
                          >
                            {ele.version}
                          </span>
                        ))}
                    </p>
                  </div>
                  <div className="row-start-3 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">PCP: </span>
                      {data.pcp &&
                        data.pcp.map((ele, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              ele.id &&
                              handleOpenUpdateModal(
                                ele.id,
                                ele.messageType,
                                ele.version,
                              )
                            }
                            className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1 cursor-pointer"
                          >
                            {ele.version}
                          </span>
                        ))}
                    </p>
                  </div>
                  <div className="row-start-4 row-span-1 flex items-center border-b border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Preop: </span>
                      {data.preop &&
                        data.preop.map((ele, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              ele.id &&
                              ele.dateOffset !== undefined &&
                              handleOpenUpdateModal(
                                ele.id,
                                ele.messageType,
                                ele.dateOffset,
                              )
                            }
                            className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1 cursor-pointer"
                          >
                            {ele.dateOffset}
                          </span>
                        ))}
                    </p>
                  </div>
                  <div className="row-start-5 row-span flex items-center  border-gray-200">
                    <p>
                      <span className="font-bold text-sm">Postop: </span>
                      {data.postop &&
                        data.postop.map((ele, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              ele.id &&
                              ele.dateOffset !== undefined &&
                              handleOpenUpdateModal(
                                ele.id,
                                ele.messageType,
                                ele.dateOffset,
                              )
                            }
                            className="ml-1 rounded pt-1.5 pb-1.5 pr-2 pl-1.5 bg-green-500 text-white mr-1 cursor-pointer"
                          >
                            {ele.dateOffset}
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <FormModal />
      <TemplateUpdateModal />
    </div>
  );
};

export default Templates;
