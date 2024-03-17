import { publicRuntimeConfig } from 'next.config';

export const getMedia = async () => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/practices/12e738c5-bded-4733-837f-b6fa987284cf/videos`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0N2JmMjdhLTRiNTAtNGUwYS04NjMzLTI4MDM0NWQxOWIzYiIsImRhdGVDcmVhdGVkIjoiMjAyNC0wMy0xM1QwMDozODowMC45MTlaIiwiZGF0ZVVwZGF0ZWQiOiIyMDI0LTAzLTEzVDAwOjM4OjAwLjkxOVoiLCJlbWFpbCI6InB1bGtlc2hAdGhpbmtzeXMuY29tIiwidXNlck5hbWUiOiJ0cml5YW5rX3RqIiwiZmlyc3ROYW1lIjoiUHVsa2VzaCIsImxhc3ROYW1lIjoiSmFpbiIsImZ1bGxOYW1lIjoiUHVsa2VzaCBKYWluIiwidXJsIjpudWxsLCJzdGF0dXMiOiJhY3RpdmUiLCJ0eXBlIjoiZW1wbG95ZWUiLCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTA2ODAyNjIsImV4cCI6MTcxMDc2NjY2Mn0.GCwT_FDGe36YaQk2JUBbTFdyKUCQRcWgqiAmXVZGrb0',
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};
