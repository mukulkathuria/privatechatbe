export type loginParams = {
  username?: string;
  password?: string;
};

type loginError = {
  status: number;
  message: string;
};

export type authtokenDto = {
  username: string;
  name: string;
  roles: string;
};

export interface loginReturnDto {
  access_token?: string;
  refresh_token?: string;
  error?: loginError;
}

export type returnTokenDto = {
  access_token: string;
  refresh_token: string;
  success: boolean;
};

export interface errorDto {
  error?: loginError;
}
