import { Jwt } from 'src/data/refreshTokens';
import { decryptRefreshToken } from 'src/utils/crypt';
import { refreshTokenParamsDto } from '../dto/register.dto';
import { decodeRefreshToken } from '../strategies/jwt.strategy';

export const refreshTokenValidate = (token: refreshTokenParamsDto) => {
  const { refresh_token } = token;
  if (!refresh_token || !refresh_token.trim().length) {
    return { error: { status: 422, message: 'Refresh token is required' } };
  }

  const { token: refreshToken, error } = decryptRefreshToken(refresh_token);
  if (error) {
    return { error: { status: 403, message: error } };
  } else if (refreshToken.split('.').length < 3) {
    return { error: { status: 403, message: 'Invalid token' } };
  }

  const { data, error: decodedErr } = decodeRefreshToken(refreshToken);
  if (decodedErr) {
    return { error: { status: 403, message: 'Invalid Token' } };
  }

  const { error: jwtErr } = Jwt.checkValidRefreshToken(data);
  if (jwtErr) {
    return { error: { status: 403, message: jwtErr } };
  }

  return { token: data };
};
