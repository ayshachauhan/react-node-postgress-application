import React from 'react';

import { Button as BaseButton, ButtonProps, KIND } from 'baseui/button';
import clsx from 'clsx';

export type Props = Partial<ButtonProps> & {
  title: string;
  width?: number;
  isWarning?: boolean;
  isDanger?: boolean;
};

const Button: React.FC<Props> = ({
  title,
  width,
  kind = 'primary',
  isWarning = false,
  isDanger = false,
  ...props
}) => {
  return (
    <BaseButton
      {...props}
      overrides={{
        Root: {
          style: width ? { width: `${width}px` } : {},
          props: {
            className: clsx({
              'btn-primary': kind === KIND.primary,
              'btn-secondary': kind === KIND.secondary,
              'btn-warning': isWarning,
              'btn-danger': isDanger,
            }),
          },
        },
        BaseButton: {
          style: () => ({
            width: width ? `${width}px` : '', // Set the desired width here
          }),
          props: {
            className: clsx({
              'btn-primary': kind === KIND.primary,
              'btn-secondary': kind === KIND.secondary,
              'btn-warning': isWarning,
              'btn-danger': isDanger,
            }),
          },
        },
      }}
    >
      {title}
    </BaseButton>
  );
};

export default Button;
