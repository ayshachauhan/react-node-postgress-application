'use client';

import { CollapseLeftIcon, CollapseRightIcon } from '@root/components/Icons';
import { useUserPermissions } from '@root/context/UserPermissionsContext';
import { useAppSelector } from '@root/store';
import { ChevronDown, ChevronRightSmall } from 'baseui/icon';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { SideBarItem, filterSidebarItems, sidebarItems } from './types';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [activeMenuItemId, setActiveMenuItemId] = useState<string>('');
  const [activeChildMenuItemId, setActiveChildMenuItemId] =
    useState<string>('');
  const userInfo = useAppSelector((state) => state.auth.user);
  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const userType = is_super_admin ? 'super_admin' : 'admin';
  const { userPermissions, updateUserPermissions } = useUserPermissions();
  const filteredSidebarItems: SideBarItem[] = filterSidebarItems(
    userType,
    userPermissions,
    sidebarItems,
  );
  const [collapsed, setCollapsed] = useState(false);
  const [hideChildMenu, setHideChildMenu] = useState(false);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const [expandedMenuItemId, setExpandedMenuItemId] = useState<string>('');

  function handleSidebarItemClick(item: SideBarItem) {
    setActiveMenuItemId(item.id);
    setExpandedMenuItemId(item.id === expandedMenuItemId ? '' : item.id);
    if (item.id === 'setting') {
      setHideChildMenu(false);
    }
    if (item.id !== 'setting') {
      setActiveChildMenuItemId('');
    }
  }

  function handleSidebarChildItemClick(item) {
    setActiveChildMenuItemId(item.id);
  }

  useEffect(() => {
    if (!userPermissions.length && userInfo && userInfo.permissions) {
      updateUserPermissions(userInfo.permissions);
    }
  }, [userPermissions, userInfo, updateUserPermissions]);

  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;
    const settingChildPath = ['/templates', '/users'];

    const activeItem = sidebarItems.find((item) => {
      const itemPath = item.path.endsWith('*')
        ? item.path.slice(0, -1)
        : item.path;
      return currentPath.startsWith(itemPath);
    });
    const activeItemForChild = sidebarItems.find(
      (item) =>
        item.child?.some((childItem) => {
          const childPath = childItem.path.endsWith('*')
            ? childItem.path.slice(0, -1)
            : childItem.path;
          return currentPath.startsWith(childPath);
        }),
    );
    const activeChildItem = activeItemForChild?.child?.find(
      (childItem) => childItem.path === currentPath,
    );

    if (activeChildItem) {
      setActiveChildMenuItemId(activeChildItem.id);
      if (settingChildPath.includes(activeChildItem.path)) {
        setActiveMenuItemId('setting');
      } else {
        if (activeItemForChild) {
          setActiveMenuItemId(activeItemForChild.id);
        }
      }
    } else if (activeItem) {
      setActiveMenuItemId(activeItem.id);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed]);

  const customWidth = collapsed ? 'w-16' : 'w-40';
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      collapsed
    ) {
      setHideChildMenu(true); // Hide child menu
    }
  };

  return (
    <aside
      aria-label="Sidebar"
      ref={sidebarRef}
      className={`${customWidth} fixed top-0 left-0 h-screen translate-x-0 bg-gradient-to-b from-primary-dark to-primary-light ease-in-out duration-400`}
    >
      <div className="h-[168px] flex px-4 items-center justify-start">
        <Link href={is_super_admin ? '' : '/dashboard'}>
          <img alt="Azentia" src="/images/azentia.svg" />
        </Link>
      </div>

      <div
        className={`h-full px-3 py-4 overflow-y-auto ${
          collapsed ? 'flex flex-col items-center' : ''
        }`}
      >
        <ul className="space-y-2 font-medium">
          {filteredSidebarItems.map(({ Icon, ...item }) => (
            <li
              key={item.id}
              className={`${collapsed && item.child ? 'flex flex-row' : ''}`}
            >
              <Link
                href={item.path}
                onClick={() => handleSidebarItemClick({ ...item, Icon })}
                className={clsx(
                  'flex items-center p-2 text-white rounded-lg ease-linear duration-200 hover:bg-secondary',
                  { 'bg-secondary': item.id === activeMenuItemId },
                )}
              >
                <Icon size={18} />
                {!collapsed && <span className="ms-3">{item.title}</span>}
                {!collapsed && item.child && (
                  <span className="ml-auto">
                    <ChevronDown size={20} />
                  </span>
                )}
              </Link>

              {item.child && !hideChildMenu && (
                <ul
                  className={clsx(
                    'ease-in-out duration-300 my-1 ml-5 py-2 space-y-2 rounded-lg',
                    {
                      hidden: item.id !== activeMenuItemId,
                      'bg-green-500 fixed ml-14 mt-0': collapsed,
                    },
                  )}
                >
                  {item.child.map((childItem) => (
                    <li key={childItem.id}>
                      <Link
                        href={childItem.path}
                        onClick={() => handleSidebarChildItemClick(childItem)}
                        className={clsx(
                          'flex items-center w-full p-1 rounded-lg group text-white text-xs font-normal',
                          {
                            'bg-secondary':
                              childItem.id === activeChildMenuItemId,
                          },
                        )}
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
        <div
          className={`bottom-5 space-y-2 fixed ${!collapsed ? 'right-3' : ''}`}
        >
          <button
            className="text-white flex items-center"
            onClick={toggleCollapse}
          >
            {collapsed ? (
              <CollapseRightIcon size={20} />
            ) : (
              <CollapseLeftIcon size={20} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
