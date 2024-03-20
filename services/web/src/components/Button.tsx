import React from 'react';

import { Button as BaseButton, ButtonProps, KIND } from 'baseui/button';
import clsx from 'clsx';

export type Props = Partial<ButtonProps> & {
  title: string;
  width?: number;
};

const Button: React.FC<Props> = ({
  title,
  width,
  kind = 'primary',
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
            }),
          },
        },
        BaseButton: {
          style: () => ({
            width: width || '', // Set the desired width here
          }),
          props: {
            className: clsx({
              'btn-primary': kind === KIND.primary,
              'btn-secondary': kind === KIND.secondary,
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
