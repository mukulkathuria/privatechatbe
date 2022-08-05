import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { loginParams, returnTokenDto } from '../user/dto/loginParams.dto';
import { AuthService } from './auth.service';
import {
  logoutParamsDto,
  refreshTokenParamsDto,
  registerRequestDto,
} from './dto/register.dto';
import { AuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServer: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async getloginUser(
    @Req() req: Request,
    @Body() value: loginParams,
  ): Promise<returnTokenDto | undefined> {
    const agentDetails = new UAParser()
      .setUA(req.headers['user-agent'])
      .getResult();
    const { access_token, refresh_token, error } =
      await this.authServer.loginUser(value, agentDetails);
    if (access_token) {
      return { access_token, refresh_token, success: true };
    } else if (error) {
      throw new HttpException(error.message, error.status);
    } else {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Post('register')
  @HttpCode(200)
  async getRegister(
    @Req() req: Request,
    @Body() value: registerRequestDto,
  ): Promise<returnTokenDto> {
    const agentDetails = new UAParser()
      .setUA(req.headers['user-agent'])
      .getResult();
    const { error, access_token, refresh_token } =
      await this.authServer.createUser(value, agentDetails);
    if (access_token && refresh_token) {
      return {
        access_token,
        refresh_token,
        success: true,
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('refreshtoken')
  @HttpCode(200)
  async getRefreshToken(@Body() token: refreshTokenParamsDto) {
    const { error, access_token } = await this.authServer.getRefeshToken(token);
    if (access_token) {
      return {
        access_token,
        success: true,
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logoutUser(@Req() req: logoutParamsDto) {
    const { success, error } = await this.authServer.getLogout(req);
    if (success) {
      return {
        success: true,
        messasge: 'Successfully removed the user',
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('removerefreshtoken')
  async removeRefreshToken() {
    return this.authServer.removeJwtRefreshToken();
  }
}
