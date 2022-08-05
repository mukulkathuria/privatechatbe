import { SignOptions } from 'jsonwebtoken';

export const accessTokenConfig: SignOptions = {
  expiresIn: '2h',
  algorithm: 'HS256',
};

export const refreshTokenConfig: SignOptions = {
  expiresIn: '5h',
  algorithm: 'HS256',
};

export const AccessTokenSecret = 'SECRET';
export const RefreshTokenSecret = 'REFRESH_SECRET';
