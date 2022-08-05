import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigUserProfile } from 'src/constants/multer.config';
import { imageFileFilter } from 'src/utils/multer.utils';
import { logoutParamsDto } from '../auth/dto/register.dto';
import { AuthGuard } from '../auth/guards/jwt.guard';
import { updateUserQueryDto } from './dto/updateUser.dto';
import {
  addContactsParams,
  chatContactUserDto,
  chatRoomParamsDto,
  getUserBodyDto,
  resultUserDetailDto,
} from './dto/userDetails.dto';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('user')
  @HttpCode(200)
  async getUserDetail(
    @Req() req: getUserBodyDto,
  ): Promise<resultUserDetailDto> {
    const { error, user } = await this.userService.getUser(req);
    if (user) {
      return {
        user,
        success: true,
      };
    } else if (error) {
      new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('user/chat')
  @HttpCode(200)
  async addChat(
    @Req() req: getUserBodyDto,
    @Body() chatUser: chatContactUserDto,
  ): Promise<resultUserDetailDto> {
    const { username } = req;
    const { username: contactUsername } = chatUser;
    const { user, error } = await this.userService.addChatsinChatBox({
      username,
      contactUsername,
    });
    if (user) {
      return {
        user,
        success: true,
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/user/addContact')
  @HttpCode(200)
  async addContactsinUser(@Body() user: addContactsParams) {
    const { data, error } = await this.userService.addContacts(user);
    if (data) {
      return {
        success: true,
        message: 'Successfully update the contact',
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/user/removechatpermanent')
  @HttpCode(200)
  async removechatroom(@Body() chatroom: chatRoomParamsDto) {
    const { roomid } = chatroom;
    if (roomid && roomid.trim().length) {
      const { data, error } = await this.userService.removeChatRoomPermanently(
        roomid,
      );
      if (data) {
        return {
          success: true,
          message: 'Successfully deleted the room',
        };
      } else {
        throw new HttpException(error.message, error.status);
      }
    } else {
      throw new HttpException('Room is required', 422);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/user/deleteuser')
  @HttpCode(200)
  async deleteUser(
    @Req() req: logoutParamsDto,
    @Body() user: chatContactUserDto,
  ) {
    const { roles, reId, username: contactuser } = req;
    const { username } = user;
    const { success, error } = await this.userService.removeUserPermanently({
      username,
      roles,
      reId,
      contactuser,
    });
    if (success) {
      return {
        success: true,
        message: 'Successfully removed the user',
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/user/updateuser')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: multerConfigUserProfile,
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  @HttpCode(200)
  async updateuser(
    @Query() query: updateUserQueryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: getUserBodyDto,
  ) {
    const { user, error } = await this.userService.updateUserDetails({
      query,
      file,
      username: req.username,
    });
    if (user) {
      return {
        success: true,
        user,
      };
    } else {
      throw new HttpException(error.message, error.status);
    }
  }
}
