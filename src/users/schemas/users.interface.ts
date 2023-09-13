/* eslint-disable prettier/prettier */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface IUserTokenPayload extends IUser {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface IUserToken extends IUser {
  accessToken: string;
  user: Partial<IUser>;
}
