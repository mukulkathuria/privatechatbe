import { PasswordRegex } from 'src/constants/Regex';
import { GenderEnum } from 'src/Models/dto/user.dto';
import { registerRequestDto } from '../dto/register.dto';

export const checkrequiredFields = (data: registerRequestDto) => {
  const { name, username, password, gender } = data;
  if (!username || !username.trim().length) {
    return { error: { status: 422, message: 'Username required' } };
  } else if (username.length <= 3) {
    return { error: { status: 422, message: 'Invalid Username' } };
  }

  if (!password) {
    return { error: { status: 422, message: 'Password required' } };
  } else if (password.length <= 8 || !PasswordRegex.test(password)) {
    return { error: { status: 422, message: 'Password invalid' } };
  }

  if (!name || !name.trim().length) {
    return { error: { status: 422, message: 'Name required' } };
  }

  if (!gender || !Object.values(GenderEnum).includes(gender)) {
    return { error: { status: 422, message: 'Invalid Gender' } };
  }
  return { data };
};
