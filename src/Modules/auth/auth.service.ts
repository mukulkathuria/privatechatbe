import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import {
  accessTokenConfig,
  AccessTokenSecret,
  refreshTokenConfig,
  RefreshTokenSecret,
} from 'src/constants/jwt.config';
import { USERDOCUMENT } from 'src/constants/mongoose.documents';
import { Jwt } from 'src/data/refreshTokens';
import { Role, UserModelDto } from 'src/Models/dto/user.dto';
import { decrypt, encrypt, encryptRefreshToken } from 'src/utils/crypt';
import { uuid } from 'src/utils/uuid';
import UAParser from 'ua-parser-js';
import {
  authtokenDto,
  loginParams,
  loginReturnDto,
} from '../user/dto/loginParams.dto';
import {
  logoutParamsDto,
  refreshTokenParamsDto,
  registerRequestDto,
} from './dto/register.dto';
import { decodeRefreshToken } from './strategies/jwt.strategy';
import { loginValidate } from './validation/loginValidate';
import { refreshTokenValidate } from './validation/refreshTokenValidate';
import { checkrequiredFields } from './validation/registerValidate';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USERDOCUMENT) private userModel: Model<UserModelDto>,
  ) {}

  async loginUser(
    params: loginParams,
    agentDetails: UAParser.IResult,
  ): Promise<loginReturnDto> {
    const { error } = loginValidate(params);
    if (error) {
      return { error: error };
    }
    const { username, password } = params;
    try {
      const currentUser = await this.userModel.findOne({ username });
      if (!currentUser) {
        return {
          error: { status: 422, message: 'Username password not valid' },
        };
      } else if (password !== decrypt(currentUser.password)) {
        return {
          error: { status: 422, message: 'Username password not valid' },
        };
      }
      const agent = agentDetails.ua.includes('Postman');
      await this.userModel.findOneAndUpdate(
        { username },
        {
          lastLogin: new Date(),
          browser: agent
            ? agentDetails.ua
            : agentDetails.browser.name + ' ' + agentDetails.browser.version,
          userOs: agent
            ? agentDetails.ua
            : agentDetails.os.name + ' ' + agentDetails.os.version,
        },
      );
      if (currentUser) {
        const { access_token, refresh_token } = await this.getUserToken(
          currentUser,
        );
        return { access_token, refresh_token };
      }
    } catch (error) {
      return {
        error: { status: 500, message: 'Server error' },
      };
    }
  }

  async getUserToken(user: authtokenDto) {
    const payload = {
      username: user.username,
      name: user.name,
      roles: user?.roles || Role.Normal,
      gender: user.gender,
    };
    const id = uuid();
    const refresh_token = sign(
      { id, ...payload },
      process.env[RefreshTokenSecret],
      refreshTokenConfig,
    );
    let sendedToken = refresh_token as string;
    const { data } = decodeRefreshToken(refresh_token);
    if (data) {
      const { success } = Jwt.addRefreshToken(data);
      if (success) {
        const { token } = encryptRefreshToken(refresh_token as string);
        if (token) {
          sendedToken = token;
        }
      }
    }
    return {
      access_token: sign(
        { reId: id, ...payload },
        process.env[AccessTokenSecret],
        accessTokenConfig,
      ),
      refresh_token: sendedToken,
    };
  }

  async createUser(
    user: registerRequestDto,
    agentDetails: UAParser.IResult,
  ): Promise<loginReturnDto> {
    const { error } = checkrequiredFields(user);
    if (error) {
      return { error };
    }
    try {
      const existingUsername = await this.userModel.findOne({
        username: user.username,
      });
      if (existingUsername) {
        return { error: { status: 422, message: 'Username already exists' } };
      }
      const { name, username, password, gender } = user;
      const agent = agentDetails.ua.includes('Postman');
      const values = {
        username,
        name,
        password: encrypt(password),
        Chats: [],
        gender,
        profile: '',
        browser: agent
          ? agentDetails.ua
          : agentDetails.browser.name + ' ' + agentDetails.browser.version,
        userOs: agent
          ? agentDetails.ua
          : agentDetails.os.name + ' ' + agentDetails.os.version,
        Contacts: [],
        roles: Role.Normal,
      };
      const data = await new this.userModel(values);
      data.save();
      const { access_token, refresh_token } = await this.getUserToken(data);
      return { access_token, refresh_token };
    } catch (error) {
      return { error: { status: 500, message: 'Data not saved' } };
    }
  }

  async getRefeshToken(token: refreshTokenParamsDto) {
    const { token: refreshToken, error } = refreshTokenValidate(token);
    if (error) {
      return { error };
    }

    const payload = {
      reId: refreshToken.id,
      name: refreshToken.name,
      username: refreshToken.username,
      roles: refreshToken.roles,
      gender: refreshToken.gender,
    };
    return {
      access_token: sign(
        payload,
        process.env['SECRET'],
        accessTokenConfig,
      ) as string,
    };
  }

  async getLogout(user: logoutParamsDto) {
    const { username, reId } = user;
    if (!username || !username.trim().length) {
      return { error: { status: 422, message: 'Username is required' } };
    }

    const { error } = Jwt.removeToken(reId);
    if (error) {
      return { error: { status: 403, message: 'Invalid Token' } };
    }

    return { success: true };
  }

  async removeJwtRefreshToken() {
    const alltokens = Object.keys(Jwt.refreshTokens);
    let errors = 0;
    let success = 0;
    for (let i = 0; i < alltokens.length; i += 1) {
      const { error, success: totalsucess } = Jwt.removeExpiredToken(
        alltokens[i],
      );
      if (totalsucess) {
        success += 1;
      } else if (error) {
        errors += 1;
      }
    }
    return {
      totalRecords: alltokens.length,
      errors,
      success,
    };
  }
}
