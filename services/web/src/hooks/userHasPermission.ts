import { IPermission } from '@packages/entities/index.browser';
import { useMemo } from 'react';

export function useUserPermission(
  userPermissions: IPermission[] | undefined,
  requiredPermissions: string[],
) {
  const hasPermission = useMemo(() => {
    if (!userPermissions) return false;

    const userPermissionNames = userPermissions.map(
      (permission) => permission.name,
    );
    return requiredPermissions.every((permission) =>
      userPermissionNames.includes(permission),
    );
  }, [userPermissions, requiredPermissions]);

  return hasPermission;
}
