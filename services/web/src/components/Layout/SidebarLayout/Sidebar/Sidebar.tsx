'use client';

import { useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import { ChevronDown, ChevronRightSmall } from 'baseui/icon';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SideBarItem, filterSidebarItems, sidebarItems } from './types';

const Sidebar: React.FC = () => {
  const [activeMenuItemId, setActiveMenuItemId] = useState<string>('');
  const userInfo = useAppSelector(selectRecords);
  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const userType = is_super_admin ? 'super_admin' : 'admin';
  const filteredSidebarItems: SideBarItem[] = filterSidebarItems(
    userType,
    sidebarItems,
  );

  function handleSidebarItemClick(item: SideBarItem) {
    setActiveMenuItemId(item.id);
  }

  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeItem = sidebarItems.find((item) => currentPath === item.path);
    if (activeItem) {
      setActiveMenuItemId(activeItem.id);
    }
  }, []);

  return (
    <aside
      aria-label="Sidebar"
      className="fixed top-0 left-0 w-64 h-screen translate-x-0 bg-gradient-to-b from-primary-dark to-primary-light"
    >
      <div className="h-[168px] flex px-4 items-center justify-start">
        <Link href="/dashboard">
          <img alt="Azentia" src="/images/azentia.svg" />
        </Link>
      </div>

      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {filteredSidebarItems.map(({ Icon, ...item }) => (
            <li
              key={item.id}
              className={item.id == 'setting' ? 'absolute bottom-5' : ''}
            >
              <Link
                href={item.path}
                onClick={() => handleSidebarItemClick({ ...item, Icon })}
                className={clsx(
                  'flex items-center p-2 text-white rounded-lg ease-linear duration-200 hover:bg-secondary',
                  { 'bg-secondary': item.id === activeMenuItemId },
                )}
              >
                <Icon />
                <span className="ms-3">{item.title}</span>

                {item.child && (
                  <span className="ml-auto">
                    <ChevronDown size={20} />
                  </span>
                )}
              </Link>

              {item.child && (
                <ul
                  className={clsx(
                    'ease-in-out duration-300 my-1 py-2 space-y-2 rounded-lg',
                    {
                      hidden: item.id !== activeMenuItemId,
                      'bg-secondary': item.id === activeMenuItemId,
                    },
                  )}
                >
                  {item.child.map((childItem) => (
                    <li key={childItem.id}>
                      <Link
                        href={childItem.path}
                        className="flex items-center w-full p-1 rounded-lg pl-5 group text-white text-xs font-normal"
                      >
                        <span className="mr-2">
                          <ChevronRightSmall />
                        </span>
                        {childItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
