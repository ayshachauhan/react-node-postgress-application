'use client';

import { Input, InputOverrides, InputProps } from 'baseui/input';
import React from 'react';

type Props = Partial<Omit<InputProps, 'onChange'>> & {
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: () => void;
};

const TextInputOverrides: InputOverrides = {
  Root: {
    style: { border: 0, height: '48px' },
    props: { className: 'shadow-md' },
  },
};

const TextInput: React.FC<Props> = ({
  onChange,
  onBlur,
  onFocus,
  ...props
}) => {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    onChange(event.target.value);
  }

  function handleFocus(): void {
    if (onFocus) {
      onFocus();
    }
  }

  function handleBlur(event: React.FocusEvent): void {
    if (onBlur) {
      onBlur(event);
    }
  }

  return (
    <div className="d-block">
      <Input
        {...props}
        overrides={TextInputOverrides}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default TextInput;
