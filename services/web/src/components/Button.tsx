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
};

const Button: React.FC<Props> = ({
  title,
  width,
  height,
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
      style={{ ...style, backgroundColor, color }}
      overrides={{
        Root: {
          style: {
            width: width ? `${width}px` : '',
            height: height ? `${height}px` : '',
            padding: padding || '',
            fontSize: fontSize || '',
            backgroundColor: backgroundColor || '',
            color: color !== undefined ? color : 'white',
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
            backgroundColor: backgroundColor || '',
            color: color !== undefined ? color : 'white',
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
