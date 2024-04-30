'use client';

import { Input, InputOverrides, InputProps } from 'baseui/input';
import React from 'react';

type Props = Partial<Omit<InputProps, 'onChange'>> & {
  onChange: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: () => void;
  heightOverride?: string;
  fontSizeOverride?: string;
  fontWeightOverride?: string;
  fontColorOverride?: string;
};

const TextInputOverrides: InputOverrides = {
  Root: {
    style: ({ heightOverride, fontSizeOverride, fontWeightOverride }) => ({
      border: 0,
      height: heightOverride ?? '48px',
      fontSize: fontSizeOverride ?? '',
      fontWeight: fontWeightOverride ?? '',
    }),
    props: { className: 'shadow-md' },
  },
  Input: {
    props: {
      style: ({ fontColorOverride }) => ({
        backgroundColor: 'rgba(250, 250, 250, 1)',
        color: fontColorOverride ?? '',
      }),
    },
  },
};

const TextInput: React.FC<Props> = ({
  onChange,
  onBlur,
  onFocus,
  heightOverride,
  fontSizeOverride,
  fontWeightOverride,
  fontColorOverride,
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
          Root: {
            props: {
              className: 'shadow-md',
              style: {
                border: 0,
                height: heightOverride ?? '48px',
                fontSize: fontSizeOverride,
                fontWeight: fontWeightOverride,
              },
            },
          },
          Input: {
            props: {
              style: {
                color: fontColorOverride ?? 'rgba(82, 82, 91, 1)',
                backgroundColor: 'rgba(250, 250, 250, 1)',
              },
            },
          },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default TextInput;
