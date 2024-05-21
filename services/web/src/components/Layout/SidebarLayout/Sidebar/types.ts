import {
  AddReferrerIcon,
  DashboardIcon,
  HistoryIcon,
  MediaIcon,
  MessageIcon,
  SettingIcon,
  StethoscopeIcon,
  TemplateIcon,
  UsersIcon,
} from '@components/Icons';
import { IPermission } from '@packages/entities/index.browser';
import { useUserPermission } from '@root/hooks/userHasPermission';

export type SideBarItem = {
  id: string;
  title: string;
  path: string;
  permissions: string[];
  userPermissions?: string[];
  Icon: React.ElementType;
  child?: Omit<SideBarItem, 'child' | 'Icon'>[];
};

export const sidebarItems: SideBarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    permissions: ['admin'],
    Icon: DashboardIcon,
  },
  {
    id: 'practices',
    title: 'Practices',
    path: '/practices',
    permissions: ['super_admin'],
    Icon: StethoscopeIcon,
  },
  {
    id: 'users',
    title: 'Users',
    path: '/users',
    permissions: ['admin'],
    Icon: UsersIcon,
  },
  {
    id: 'templates',
    title: 'Templates',
    path: '/templates',
    permissions: ['admin'],
    userPermissions: ['view_templates'],
    Icon: TemplateIcon,
  },
  {
    id: 'messages',
    title: 'Messages',
    path: '/messages',
    permissions: ['admin'],
    userPermissions: ['view_msg'],
    Icon: MessageIcon,
  },
  {
    id: 'history',
    title: 'History',
    path: '/history',
    permissions: ['admin'],
    userPermissions: ['view_hx'],
    Icon: HistoryIcon,
  },
  {
    id: 'media',
    title: 'Media',
    path: '/media',
    permissions: ['admin'],
    userPermissions: ['view_videos'],
    Icon: MediaIcon,
  },
  {
    id: 'referrer',
    title: 'Referrer',
    path: '/referrer',
    permissions: ['admin'],
    userPermissions: ['view_referrers'],
    Icon: AddReferrerIcon,
  },

  {
    id: 'eval',
    title: 'Eval',
    path: '/eval',
    permissions: ['admin'],
    Icon: DashboardIcon,
  },
  {
    id: 'setting',
    title: 'Settings',
    path: '#',
    permissions: ['admin'],
    Icon: SettingIcon,
    child: [
      {
        id: 'configuration',
        title: 'Configuration',
        path: '/settings/configurations',
        permissions: ['admin'],
      },
      {
        id: 'modularDesign',
        title: 'Modular Fields',
        path: '/settings/modularFields',
        permissions: ['admin'],
      },
    ],
  },
];

export function filterSidebarItems(
  userType: 'super_admin' | 'admin',
  userPermissions: IPermission[],
  sidebarItems: SideBarItem[],
): SideBarItem[] {
  return sidebarItems.filter((item) => {
    const userTypeAllowed = item.permissions.includes(userType);

    const userPermissionsAllowed = item.userPermissions
      ? useUserPermission(userPermissions, item.userPermissions)
      : true;

    return userTypeAllowed && userPermissionsAllowed;
  });
}
