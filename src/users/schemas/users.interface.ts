/* eslint-disable prettier/prettier */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[]
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
