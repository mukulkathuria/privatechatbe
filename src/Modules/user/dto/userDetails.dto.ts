import { errorDto } from './loginParams.dto';
import { UserModelDto } from 'src/Models/dto/user.dto';
import { logoutParamsDto } from 'src/Modules/auth/dto/register.dto';

export type getUserBodyDto = {
  username?: string;
};

export interface chatContactUserDto {
  username?: string;
}

export interface chatContactParamsDto extends getUserBodyDto {
  contactUsername?: string;
}

export type addContactsParams = {
  currentusername: string;
  addingusername: string;
};

export interface returnUserDetailsDto extends errorDto {
  user?: Omit<UserModelDto, 'password'>;
}

export interface resultUserDetailDto extends returnUserDetailsDto {
  success: boolean;
}

export interface chatRoomParamsDto {
  roomid: string;
}

export interface authUserRoleDto extends logoutParamsDto {
  contactuser: string;
}
