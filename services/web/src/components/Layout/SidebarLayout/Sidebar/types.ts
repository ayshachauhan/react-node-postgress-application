import {
  AddReferrerIcon,
  //ChatIcon,
  DashboardIcon,
  HistoryIcon,
  MediaIcon,
  MessageIcon,
  SettingIcon,
  StethoscopeIcon,
} from '@components/Icons';
import { IPermission } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';

import ReviewIcon from '@root/components/Icons/Review';

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
  // {
  //   id: 'ai',
  //   title: 'Chat History',
  //   path: '/ai',
  //   permissions: ['admin'],
  //   Icon: ChatIcon,
  // },
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
    id: 'review',
    title: 'Review',
    path: '/review',
    permissions: ['admin'],
    userPermissions: [USER_PERMISSIONS.VIEW_REP],
    Icon: ReviewIcon,
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
  const hasPermission = (permissions: string[] | undefined): boolean => {
    if (!permissions) return true;
    return permissions.every((permission) =>
      userPermissions.some(
        (userPermission) => userPermission.name === permission,
      ),
    );
  };

  const filterItem = (item: SideBarItem): SideBarItem | null => {
    const userTypeAllowed = item.permissions.includes(userType);
    const userPermissionsAllowed = hasPermission(item.userPermissions);

    if (!userTypeAllowed || !userPermissionsAllowed) {
      return null;
    }

    // Recursively filter child items if they exist
    const filteredChildren = item.child
      ? item.child.reduce<SideBarItem[]>((acc, childItem) => {
          const filteredChild = filterItem(childItem as SideBarItem);
          if (filteredChild) {
            acc.push(filteredChild);
          }
          return acc;
        }, [])
      : undefined;

    const newItem: SideBarItem = {
      ...item,
      child:
        filteredChildren && filteredChildren.length > 0
          ? filteredChildren
          : undefined,
    };

    return newItem;
  };

  const filteredItems = sidebarItems.reduce<SideBarItem[]>((acc, item) => {
    const filteredItem = filterItem(item);
    if (filteredItem) {
      acc.push(filteredItem);
    }
    return acc;
  }, []);

  return filteredItems;
}
