import { loginParams } from 'src/Modules/user/dto/loginParams.dto';

export const loginValidate = (user: loginParams) => {
  const { username, password } = user;
  if (!username) {
    return { error: { status: 422, message: 'Username is required' } };
  } else if (!password || !password.trim().length) {
    return { error: { status: 422, message: 'Password is required' } };
  }
  return { user };
};
