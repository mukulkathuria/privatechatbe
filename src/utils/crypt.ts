import { uuid } from './uuid';

export const encrypt = (str: string): string => {
  const id = uuid().substring(2, 10);
  const encryptphase1 = btoa(str + id);
  return btoa(encryptphase1);
};

export const decrypt = (str: string): string => {
  const decryptphase1 = atob(str);
  const decrypted = atob(decryptphase1).slice(0, -8);
  return decrypted;
};

export const encryptRefreshToken = (token: string) => {
  const splitedToken = token.split('.');
  if (splitedToken.length < 3) {
    return { error: 'Invalid Token' };
  }
  splitedToken[1] = encrypt(splitedToken[1]);
  return { token: btoa(splitedToken.join('.')) };
};

export const decryptRefreshToken = (token: string) => {
  const splitedToken = atob(token).split('.');
  if (splitedToken.length < 3) {
    return { error: 'Token not valid' };
  }
  splitedToken[1] = decrypt(splitedToken[1]);
  return { token: splitedToken.join('.') };
};
