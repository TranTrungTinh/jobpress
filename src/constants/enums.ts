/* eslint-disable prettier/prettier */
export const genderList = ['male', 'female', 'other'] as const;
export type Gender = (typeof genderList)[number];
