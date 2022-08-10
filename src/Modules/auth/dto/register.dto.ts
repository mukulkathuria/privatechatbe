import { GenderEnum } from 'src/Models/dto/user.dto';

export type registerRequestDto = {
  name: string;
  username: string;
  password: string;
  gender: GenderEnum;
};

export type refreshTokenParamsDto = {
  refresh_token: string;
};

export type logoutParamsDto = {
  username: string;
  reId: string;
  roles: string;
};
