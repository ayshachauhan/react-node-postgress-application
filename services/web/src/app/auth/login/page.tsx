'use client';

import React from 'react';

import TextInput from '@components/TextInput';
import Button from '@root/components/Button';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>Login Page!</h1>

      <TextInput value="" onChange={() => {}} />

      <Button kind="secondary" title="Submit" />
    </div>
  );
};

export default LoginPage;
