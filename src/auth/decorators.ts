import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);


export const PERMISSION_KEY = 'permission';
export const Permission = (...permission: string[]) => SetMetadata(PERMISSION_KEY, permission);
