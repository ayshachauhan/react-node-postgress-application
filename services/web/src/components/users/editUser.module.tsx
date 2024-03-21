import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { User } from '@root/components/users/types';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { fetchUserInfo, updateRecordAsync } from '@root/store/reducers/users';
import { generateFullName } from '@utils/methods';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}
const EditUserPage: React.FC<ChildProps> = ({ data, onClose }) => {
  const dispatch = useAppDispatch();
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store
  const userInfo = useAppSelector((state) => state.users.userInfo);
  console.log(userInfo);
  const userId = data.id;
  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchUserInfo({ id: userId, practiceId: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, userId, dispatch]);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  // const [practiceId, setPracticeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [lastName, setLastName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedValue, setSelectedValue] = useState([]);
  const status = selectedLabel;

  // Handler function to update the selected value
  const handleChange = ({ value }) => {
    setSelectedValue(value);
    setSelectedLabel(value.length > 0 ? value[0].label : ''); // Extract label from the selected option
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = generateFullName(firstName, lastName);
    if (userId && practiceId) {
      const id = userId;
      const userPayloadData: User = {
        practiceId,
        id,
        email,
        userName,
        firstName,
        lastName,
        fullName,
        url,
        type,
        status,
        contactNo,
      };

      try {
        dispatch(updateRecordAsync(userPayloadData));
        onClose(); // Close the modal after form submission
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label htmlFor="userName" className="text-black text-sm">
            Username
          </label>
          <TextInput
            name="userName"
            value={userInfo?.userName}
            onChange={(value) => {
              setUserName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="email" className="text-black text-sm">
            Email
          </label>
          <TextInput
            name="email"
            value={userInfo?.email}
            onChange={(value) => {
              setEmail(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="firstName" className="text-black text-sm">
            First Name
          </label>
          <TextInput
            name="firstName"
            value={userInfo?.firstName}
            onChange={(value) => {
              setFirstName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="lastName" className="text-black text-sm">
            Last Name
          </label>
          <TextInput
            name="lastName"
            value={userInfo?.lastName}
            onChange={(value) => {
              setLastName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="contactNo" className="text-black text-sm">
            Contact No.
          </label>
          <TextInput
            name="contactNo"
            value={contactNo}
            onChange={(value) => {
              setContactNo(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="url" className="text-black text-sm">
            User URL
          </label>
          <TextInput
            name="url"
            value={userInfo?.url}
            onChange={(value) => {
              setUrl(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="type" className="text-black text-sm">
            Designation
          </label>
          <TextInput
            name="type"
            value={userInfo?.type}
            onChange={(value) => {
              setType(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="status" className="text-black text-sm">
            Status
          </label>
          <Select
            options={[
              { label: 'active', id: '1' },
              { label: 'inactive', id: '2' },
            ]}
            onChange={handleChange}
            value={selectedValue}
          />
          <div className="space-y-4"></div>
        </div>
        <div className="text-right text-base">
          <Button kind="primary" title="Update" width={189} />
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
