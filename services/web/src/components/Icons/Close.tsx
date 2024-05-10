import { Icon, IconProps } from 'baseui/icon';
import React from 'react';

export default function CloseIcon(props: IconProps) {
  return (
    <Icon {...props} title="Close" viewBox="0 0 10 10">
      <path d="M1 10L0 9L4 5L0 1L1 0L5 4L9 0L10 1L6 5L10 9L9 10L5 6L1 10Z" />
    </Icon>
  );
}
