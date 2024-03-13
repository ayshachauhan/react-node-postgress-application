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
  Icon: React.ElementType;
  child?: Omit<SideBarItem, 'child' | 'Icon'>[];
};

export const sidebarItems: SideBarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    Icon: DashboardIcon,
  },
  {
    id: 'practices',
    title: 'Practices',
    path: '/practices',
    Icon: StethoscopeIcon,
  },
  {
    id: 'users',
    title: 'Users',
    path: '/users',
    Icon: UsersIcon,
    child: [{ id: 'test', title: 'Add User', path: 'test' }],
  },
  {
    id: 'templates',
    title: 'Templates',
    path: '/templates',
    Icon: TemplateIcon,
  },
  {
    id: 'messages',
    title: 'Messages',
    path: '/messages',
    Icon: MessageIcon,
  },
  {
    id: 'history',
    title: 'History',
    path: '/history',
    Icon: HistoryIcon,
  },
  {
    id: 'media',
    title: 'Media',
    path: '/media',
    Icon: MediaIcon,
  },
  {
    id: 'setting',
    title: 'Setting',
    path: '/setting',
    Icon: SettingIcon,
  },
];
