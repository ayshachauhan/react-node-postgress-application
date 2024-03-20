import {
  DashboardIcon,
  HistoryIcon,
  MediaIcon,
  MessageIcon,
  SettingIcon,
  StethoscopeIcon,
  TemplateIcon,
  UsersIcon,
} from '@components/Icons';

export type SideBarItem = {
  id: string;
  title: string;
  path: string;
  permissions: string[]; // Array of user types that have access to this item
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
    child: [
      { id: 'test', title: 'Add User', path: 'test', permissions: ['admin'] },
    ],
  },
  {
    id: 'templates',
    title: 'Templates',
    path: '/templates',
    permissions: ['admin'],
    Icon: TemplateIcon,
  },
  {
    id: 'messages',
    title: 'Messages',
    path: '/messages',
    permissions: ['admin'],
    Icon: MessageIcon,
  },
  {
    id: 'history',
    title: 'History',
    path: '/history',
    permissions: ['admin'],
    Icon: HistoryIcon,
  },
  {
    id: 'media',
    title: 'Media',
    path: '/media',
    permissions: ['admin'],
    Icon: MediaIcon,
  },
  {
    id: 'setting',
    title: 'Setting',
    path: '/setting',
    permissions: ['admin'],
    Icon: SettingIcon,
  },
];

export function filterSidebarItems(
  userType: 'super_admin' | 'admin',
  sidebarItems: SideBarItem[],
): SideBarItem[] {
  return sidebarItems.filter((item) => item.permissions.includes(userType));
}
