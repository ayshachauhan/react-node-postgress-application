import {
  AddReferrerIcon,
  DashboardIcon,
  HistoryIcon,
  MediaIcon,
  MessageIcon,
  SettingIcon,
  StethoscopeIcon,
} from '@components/Icons';
import { IPermission } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
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
    id: 'evals',
    title: 'Evals',
    path: '/eval',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_NURTURE],
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
    id: 'messages',
    title: 'Messages',
    path: '/messages',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_MSG],
    Icon: MessageIcon,
  },
  {
    id: 'history',
    title: 'History',
    path: '/history',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_HX],
    Icon: HistoryIcon,
  },
  {
    id: 'media',
    title: 'Media',
    path: '/media',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_VIDEOS],
    Icon: MediaIcon,
  },
  {
    id: 'referrer',
    title: 'Referrer',
    path: '/referrer',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_REFERRERS],
    Icon: AddReferrerIcon,
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
        title: 'Practice settings',
        path: '/settings/configurations',
        permissions: ['admin'],
      },
      {
        id: 'modularDesign',
        title: 'Surgeries',
        path: '/settings/modularFields',
        permissions: ['admin'],
      },
      {
        id: 'templates',
        title: 'Templates',
        path: '/templates',
        permissions: ['admin'],
        userPermissions: [USER_PERMISSIONS.VIEW_TEMPLATES],
      },
      {
        id: 'users',
        title: 'Users',
        path: '/users',
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
