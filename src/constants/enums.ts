/* eslint-disable prettier/prettier */
export enum EGender {
  male = 'male',
  female = 'female',
  other = 'other'
}
export const genderList = ['male', 'female', 'other'] as const;
export type Gender = (typeof genderList)[number];

export enum UserRole {
  superAdmin = 'super_admin',
  admin = 'admin',
  hr = 'hr',
  employee = 'employee',
}
export const userRoleList = ['super_admin', 'admin', 'hr', 'employee'] as const;
export type RoleType = (typeof genderList)[number];

export const AppConfig = {
  ADMIN_EMAIL: 'tttinh@gmail.com'
}
