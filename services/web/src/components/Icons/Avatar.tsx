import { Icon, IconProps } from 'baseui/icon';
import React from 'react';

export default function AvatarIcon(props: IconProps) {
  return (
    <Icon {...props} title="Avatar" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" stroke="#A0AEC0" fill="transparent" />
      <path d="M6 18c0-3 6-3 6-3s6 0 6 3"></path>
      <circle cx="12" cy="9" r="4"></circle>
    </Icon>
  );
}
