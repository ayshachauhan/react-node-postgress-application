import clsx from 'clsx';
import React, { useState } from 'react';

import { styled } from 'baseui';
import { Button, ButtonProps } from 'baseui/button';
import { Popover, PopoverPlacement } from 'baseui/popover';

const DropDownItemContainer = styled<'div', { width: number }>(
  'div',
  ({ width }) => ({ width: `${width}px` }),
);

type Props = {
  trigger: JSX.Element;
  children: React.ReactNode;
  onSelect?: (id: string) => void;
  position?: PopoverPlacement;
  width?: number;
};

type ItemProps = ButtonProps & {
  id: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Dropdown = ({
  children,
  trigger,
  width = 200,
  position,
  onSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleDropdownOpen() {
    setIsOpen(true);
  }

  function handleDropdownClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Popover
        isOpen={isOpen}
        placement={position}
        onClick={handleDropdownOpen}
        onClickOutside={handleDropdownClose}
        overrides={{ Body: { style: { zIndex: 90 } } }}
        content={
          <DropDownItemContainer
            width={width}
            className={clsx(
              'z-10 bg-white divide-y rounded-lg shadow flex flex-col',
            )}
          >
            {React.Children.map(
              children,
              function (child: React.ReactNode): React.ReactNode {
                if (React.isValidElement(child)) {
                  const { id, onClick, ...childProps } = child.props;
                  return React.cloneElement(child, {
                    ...childProps,
                    onClick: (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                      if (onClick) {
                        onClick(event);
                      }
                      if (event.defaultPrevented) {
                        return;
                      }
                      if (onSelect) {
                        onSelect(id);
                      }
                      handleDropdownClose();
                    },
                  });
                }
                return null;
              },
            )}
          </DropDownItemContainer>
        }
      >
        <div
          className="inline-flex cursor-pointer"
          onClick={handleDropdownOpen}
        >
          {trigger}
        </div>
      </Popover>
    </>
  );
};

const DropdownItem: React.FC<ItemProps> = ({ children, ...props }) => {
  return (
    <Button
      kind="tertiary"
      overrides={{
        Root: { style: { width: '100%' } },
        BaseButton: { style: { justifyContent: 'left', boxShadow: 'none' } },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

Dropdown.Item = DropdownItem;
export default Dropdown;
