import React from 'react';

import { Button as BaseButton, ButtonProps, KIND } from 'baseui/button';
import clsx from 'clsx';

export type Props = Partial<ButtonProps> & {
  title: string;
  width?: number;
  height?: number;
  padding?: string;
  fontSize?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  title,
  width,
  height,
  disabled,
  padding,
  fontSize,
  style,
  backgroundColor,
  color,
  kind = 'primary',
  ...props
}) => {
  return (
    <BaseButton
      {...props}
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            width: width ? `${width}px` : '',
            height: height ? `${height}px` : '',
            padding: padding || '',
            fontSize: fontSize || '',
            backgroundColor: disabled
              ? '#ccc'
              : backgroundColor || $theme.colors.buttonPrimaryFill,
            color: disabled ? '#666' : color || $theme.colors.buttonPrimaryText,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }),
          props: {
            className: clsx({
              'btn-primary': kind === KIND.primary,
              'btn-secondary': kind === KIND.secondary,
              'btn-tertiary': kind === KIND.tertiary,
            }),
          },
        },
      }}
      style={style}
    >
      {title}
    </BaseButton>
  );
};

export default Button;
