import { PasswordRegex } from 'src/constants/Regex';
import { registerRequestDto } from '../dto/register.dto';

export const checkrequiredFields = (data: registerRequestDto) => {
  const { name, username, password } = data;
  if (!username) {
    return { error: { status: 422, message: 'Username required' } };
  } else if (username.length <= 3) {
    return { error: { status: 422, message: 'Invalid Username' } };
  }

  if (!password) {
    return { error: { status: 422, message: 'Password required' } };
  } else if (password.length <= 3 || !PasswordRegex.test(password)) {
    return { error: { status: 422, message: 'Password invalid' } };
  }

  if (!name) {
    return { error: { status: 422, message: 'Name required' } };
  }

  return { data };
};
