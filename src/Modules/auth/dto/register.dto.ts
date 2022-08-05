export type registerRequestDto = {
  name: string;
  username: string;
  password: string;
};

export type refreshTokenParamsDto = {
  refresh_token: string;
};

export type logoutParamsDto = {
  username: string;
  reId: string;
  roles: string;
};
