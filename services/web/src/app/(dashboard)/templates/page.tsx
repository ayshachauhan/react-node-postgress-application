'use client';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Loader from '@root/components/loader';
import AddTemplateModal from '@root/components/templates/AddTemplateModal';
import UpdateTemplateModal from '@root/components/templates/UpdateTemplateModal';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchListings as fetchSurgeryList } from '@root/store/reducers/surgery';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
} from '@root/store/reducers/templates';
import { getCurrentMonthName, getPracticeId } from '@utils/index';
import React, { useEffect, useState } from 'react';

const Templates: React.FC = () => {
  const templates = useAppSelector((state) =>
    Object.values(state.templates.entities),
  );
  const dispatch = useAppDispatch();
  const { isLoading, withLoader } = useLoader();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string | null>(null);
  const [versionOffset, setVersionOffset] = useState<string | number | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const practiceId = getPracticeId();
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.templates.successMessage,
    errorMessage: state.templates.errorMessage,
  }));
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const handleOpenUpdateModal = (
    Id: string,
    MessageType: string,
    versionOffset: string | number | null,
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
  const userInfo = useAppSelector((state) => state.auth.user);
  const userId = userInfo?.id;

  const showDateOffsetControl = (value: string) => {
    return (
      value &&
      (value.toLowerCase().indexOf('preop') !== -1 ||
        value.toLowerCase().indexOf('preops') !== -1 ||
        value.toLowerCase().indexOf('postops') !== -1 ||
        value.toLowerCase().indexOf('postop') !== -1)
    );
  };

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId && userId) {
      const formattedPracticeId = practiceId ?? '';
      const formattedUserId = userId ?? '';
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(
            fetchListings({
              practiceId: formattedPracticeId,
              userId: formattedUserId,
            }),
          );
        });
      };

      loadData();
    }
  }, [practiceId, userId, dispatch, withLoader]);

  useEffect(() => {
    (async () => {
      if (practiceId) {
        await dispatch(
          fetchSurgeryList({
            loggedInUserId: userId,
            practiceId,
            month: getCurrentMonthName(),
          }),
        );
      }
    })();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      if (practiceId && userId) {
        await dispatch(
          fetchListings({
            practiceId,
            userId,
          }),
        );
      }
    };

    if (
      successMessage &&
      successMessage.trim() === 'Template deleted successfully.' &&
      practiceId &&
      userId
    ) {
      timeoutId = setTimeout(fetchData, 2000);
    } else {
      fetchData(); // Immediately fetch data
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [successMessage, dispatch, practiceId, userId]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 1000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 1000);
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
        <span className="text-xl font-bold">Template Engine </span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          padding="5px 8px"
          title="Add New"
          onClick={handleOpenAddModal}
          startEnhancer={() => <AddIcon></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="flex flex-wrap gap-7">
        {!isLoading &&
          templates.map((data, i) => (
            <React.Fragment key={i}>
              <div className="rounded-lg shadow-md w-[370px] h-292 relative">
                <div className="text-white py-2.5 text-center bg-gradient-to-r from-primary-light to-primary-dark uppercase rounded-t-lg font-bold">
                  {data?.surgeryConfigurationName}
                </div>
                <div className="rounded-lg">
                  <div className="h-full p-2">
                    <div className="min-h-10 flex items-center border-b py-1 border-gray-200">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Booking: </p>{' '}
                        <div className="flex flex-wrap gap-1">
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
                                className="rounded p-2 bg-green-500 text-white cursor-pointer"
                              >
                                {ele.version}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="min-h-10 flex items-center border-b py-1 border-gray-200">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Referrer: </p>
                        <div className="flex flex-wrap gap-1">
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
                                className="rounded p-2 bg-green-500 text-white cursor-pointer"
                              >
                                {ele.version}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="min-h-10 flex items-center border-b py-1 border-gray-200">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">PCP: </p>
                        <div className="flex flex-wrap gap-1">
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
                                className="rounded p-2 bg-green-500 text-white cursor-pointer"
                              >
                                {ele.version}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="min-h-10 flex items-center border-b py-1 border-gray-200">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Preop: </p>
                        <div className="flex flex-wrap gap-1">
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
                                className="rounded p-2 bg-green-500 text-white cursor-pointer"
                              >
                                {ele.dateOffset}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="min-h-10 flex items-center py-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Postop: </p>
                        <div className="flex flex-wrap gap-1">
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
                                className="rounded p-2 bg-green-500 text-white cursor-pointer"
                              >
                                {ele.dateOffset}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>
      <AddTemplateModal
        isAddModalOpen={isAddModalOpen}
        handleCloseAddModal={handleCloseAddModal}
        withLoader={withLoader}
        showDateOffsetControl={showDateOffsetControl}
      />
      <UpdateTemplateModal
        isUpdateModalOpen={isUpdateModalOpen}
        handleCloseUpdateModal={handleCloseUpdateModal}
        templateId={templateId}
        messageType={messageType}
        versionOffset={versionOffset}
        withLoader={withLoader}
        showDateOffsetControl={showDateOffsetControl}
      />
    </div>
  );
};

export default Templates;
