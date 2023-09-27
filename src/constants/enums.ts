/* eslint-disable prettier/prettier */
export const genderList = ['male', 'female', 'other'] as const;
export type Gender = (typeof genderList)[number];

export enum UserRole {
  admin = 'admin',
  hr = 'hr',
  employee = 'employee',
}
export const userRoleList = ['admin', 'hr', 'employee'] as const;
export type RoleType = (typeof genderList)[number];

export const AppConfig = {
  ADMIN_EMAIL: 'tttinh@gmail.com'
}
