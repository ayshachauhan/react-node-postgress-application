import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import React, { useState } from 'react';
import { publicRuntimeConfig } from '../../../next.config';

export default function MediaModule() {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;

  // State to store form values
  const [formData, setFormData] = useState<AddMedia[]>([]);

  // Function to handle form field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/practices/12e738c5-bded-4733-837f-b6fa987284cf/videos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0N2JmMjdhLTRiNTAtNGUwYS04NjMzLTI4MDM0NWQxOWIzYiIsImRhdGVDcmVhdGVkIjoiMjAyNC0wMy0xM1QwMDozODowMC45MTlaIiwiZGF0ZVVwZGF0ZWQiOiIyMDI0LTAzLTEzVDAwOjM4OjAwLjkxOVoiLCJlbWFpbCI6InB1bGtlc2hAdGhpbmtzeXMuY29tIiwidXNlck5hbWUiOiJ0cml5YW5rX3RqIiwiZmlyc3ROYW1lIjoiUHVsa2VzaCIsImxhc3ROYW1lIjoiSmFpbiIsImZ1bGxOYW1lIjoiUHVsa2VzaCBKYWluIiwidXJsIjpudWxsLCJzdGF0dXMiOiJhY3RpdmUiLCJ0eXBlIjoiZW1wbG95ZWUiLCJpYXQiOjE3MTAzOTczMTYsImV4cCI6MTcxMDQ4MzcxNn0.C6HFSmA--JdXf5tmV-1AeYlih8PxpzO1wwygQ99Pm2U',
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <TextInput
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <TextInput
          name="url"
          value={formData.url}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="urlEmbed">URL Embed</label>
        <TextInput
          name="urlEmbed"
          value={formData.urlEmbed}
          onChange={handleInputChange}
        />
      </div>
      {/* <div>
        <label htmlFor="practiceId">Practice ID</label>
        <TextInput value={formData.practiceId} onChange={handleInputChange} />
      </div> */}
      <Button kind="primary" title="Add new video" />
    </form>
  );
}

interface AddMedia {
  id: string;
  name: string;
  urlEmbed: string;
  url: string;
  dateCreated: Date;
  dateUpdated: Date;
}
