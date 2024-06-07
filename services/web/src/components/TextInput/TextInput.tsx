'use client';

import { Input, InputOverrides, InputProps, SIZE } from 'baseui/input';
import React from 'react';

type Props = Partial<Omit<InputProps, 'onChange'>> & {
  onChange: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: () => void;
  size?: string | undefined;
};

const TextInputOverrides: InputOverrides = {
  Root: {
    style: {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
      borderRight: '0',
      border: '0',
    },
    props: { className: 'shadow-md' },
  },
};

const TextInput: React.FC<Props> = ({
  onChange,
  onBlur,
  onFocus,
  size,
  ...props
}) => {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    onChange(event.target.value, event);
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
        overrides={{
          ...TextInputOverrides,
          Input: {
            props: {
              style: {
                color: 'rgba(82, 82, 91, 1)',
                backgroundColor: 'rgba(250, 250, 250, 1)',
                paddingLeft: '8px',
                paddingRight: '4px',
              },
            },
          },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        size={size ? size : SIZE.default}
      />
    </div>
  );
};

export default TextInput;
