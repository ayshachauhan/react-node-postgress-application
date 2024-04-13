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
};

const Button: React.FC<Props> = ({
  title,
  width,
  height,
  padding,
  fontSize,
  style,
  kind = 'primary',
  ...props
}) => {
  return (
    <BaseButton
      {...props}
      style={style}
      overrides={{
        Root: {
          style: {
            width: width ? `${width}px` : '',
            height: height ? `${height}px` : '',
            padding: padding || '',
            fontSize: fontSize || '',
          },
          props: {
            className: clsx({
              'btn-primary': kind === KIND.primary,
              'btn-secondary': kind === KIND.secondary,
            }),
          },
        },
        BaseButton: {
          style: () => ({
            width: width ? `${width}px` : '',
            height: height ? `${height}px` : '',
            padding: padding || '',
            fontSize: fontSize || '',
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
