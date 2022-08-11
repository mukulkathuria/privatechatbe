import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { chatModelDto } from 'src/Models/dto/chatmodel.dto';
import { ChatRoomDto, Role, UserModelDto } from 'src/Models/dto/user.dto';
import { removeUserPic } from 'src/utils/multer.utils';
import { uuid } from 'src/utils/uuid';
import { searchUserQuery, updateUserParams } from './dto/updateUser.dto';
import {
  addContactsParams,
  authUserRoleDto,
  chatContactParamsDto,
  getUserBodyDto,
  returnUserDetailsDto,
} from './dto/userDetails.dto';
import { checkContactUsername } from './validation/contacts.validation';
import {
  searchUserValidate,
  userDetailsValidate,
} from './validation/userDetails.validation';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USERDOCUMENT) private userModel: Model<UserModelDto>,
    @InjectModel(CHATDOCUMENT) private chatModel: Model<chatModelDto>,
  ) {}

  async getUser(params: getUserBodyDto): Promise<returnUserDetailsDto> {
    const { username } = params;
    if (username) {
      const currentuser = await this.userModel
        .findOne({ username })
        .populate('Contacts', 'profile name username gender')
        .populate('Chats.user', 'profile name username gender')
        .populate('Chats.chatInfo', 'lastMessage')
        .select('name profile username Chats Contacts gender');
      if (currentuser) {
        return { user: currentuser };
      }
    } else if (!username || !username.trim().length) {
      return { error: { status: 422, message: 'Username is required' } };
    }
    return { error: { status: 500, message: 'Internal Server Error' } };
  }

  async addChatsinChatBox(
    params: chatContactParamsDto,
  ): Promise<returnUserDetailsDto> {
    const { username, contactUsername } = params;
    const data = await this.userModel
      .find({
        $or: [{ username: username }, { username: contactUsername }],
      })
      .populate('Contacts', 'profile name username gender')
      .populate('Chats.user', 'profile name username gender')
      .populate('Chats.chatInfo', 'lastMessage')
      .select('name profile username Chats Contacts gender');

    if (data.length < 2) {
      return { error: { status: 422, message: 'User is not present' } };
    }
    try {
      const createdUserRegex = new RegExp(
        `${contactUsername}.*${username}|${username}.*${contactUsername}`,
        'i',
      );
      const isChatAvailable = await this.chatModel.findOne({
        createdUser: { $regex: createdUserRegex },
      });
      let chatroomid = uuid();
      let chatid = isChatAvailable?.id;
      const currentUserData = data.find((l) => l.username === username);
      const contactUserData = data.find((l) => l.username === contactUsername);

      let currentUser = currentUserData;
      if (isChatAvailable) {
        chatroomid = isChatAvailable.chatroomid;
      } else {
        const chatroomdata = {
          chatroomid,
          createdBy: username,
          createdUser: username + contactUsername,
          users: [{ username }, { username: contactUsername }],
        };
        const chatdata = await new this.chatModel(chatroomdata);
        chatid = chatdata.id;
        chatdata.save();
      }

      if (
        !currentUserData.Chats.find(
          (t: ChatRoomDto) => t.chatroomid === chatroomid,
        )
      ) {
        currentUser = await this.userModel
          .findByIdAndUpdate(
            currentUserData._id,
            {
              $pull: { Contacts: contactUserData._id },
              $addToSet: {
                Chats: {
                  user: contactUserData.id,
                  chatroomid,
                  chatInfo: chatid,
                },
              },
            },
            { new: true },
          )
          .populate('Contacts', 'profile name username gender')
          .populate('Chats.user', 'profile name username gender')
          .populate('Chats.chatInfo', 'lastMessage')
          .select('name profile username Chats Contacts gender');
      }
      if (
        !contactUserData.Chats.find(
          (t: ChatRoomDto) => t.chatroomid === chatroomid,
        )
      ) {
        await this.userModel.findByIdAndUpdate(contactUserData._id, {
          $pull: { Contacts: currentUserData._id },
          $addToSet: {
            Chats: {
              user: currentUserData.id,
              chatroomid,
              chatInfo: chatid,
            },
          },
        });
      }

      return { user: currentUser };
    } catch (err) {
      return { error: { status: 500, message: 'Server error' } };
    }
  }

  async addContacts(contact: addContactsParams) {
    const { error } = checkContactUsername(contact);
    if (error) {
      return { error };
    }
    try {
      const { currentusername, addingusername } = contact;
      const data = await this.userModel.find({
        $or: [{ username: currentusername }, { username: addingusername }],
      });
      if (data.length < 2) {
        return { error: { status: 422, message: 'User is not present' } };
      }
      const currentUserData = data.find((l) => l.username === currentusername);
      const addingUserData = data.find((l) => l.username === addingusername);
      await this.userModel.findByIdAndUpdate(currentUserData._id, {
        $addToSet: { Contacts: addingUserData.id },
      });
      await this.userModel.findByIdAndUpdate(addingUserData._id, {
        $addToSet: { Contacts: currentUserData.id },
      });
      return { data: true };
    } catch (err) {
      return { error: { status: 500, message: 'Server issue' } };
    }
  }

  async removeChatRoomPermanently(roomid: string) {
    try {
      await this.userModel.updateMany(
        { Chats: { $ne: [], $exists: true } },
        {
          $pull: { Chats: { chatroomid: roomid } },
        },
      );
      await this.chatModel.findOneAndRemove({ chatroomid: roomid });
      return { data: true };
    } catch (err) {
      return { error: { status: 500, message: 'Server issue' } };
    }
  }

  async removeUserPermanently(user: authUserRoleDto) {
    const { username, roles, contactuser } = user;
    if (!username || !username.trim().length) {
      return { error: { status: 422, message: 'Username is required' } };
    } else if (roles !== Role.Admin && contactuser !== username) {
      return {
        error: {
          status: 403,
          message: 'You dont have right to remove the user',
        },
      };
    }
    try {
      const userdata = await this.userModel.findOne({ username });
      const chatroomids = userdata.Chats.map((l: ChatRoomDto) => l.chatroomid);
      const allChats = userdata.Chats.map((l: ChatRoomDto) => l.chatroomid);
      await this.userModel.updateMany(
        {},
        {
          $pull: {
            Chats: { chatroomid: { $in: allChats } },
            Contacts: userdata._id,
          },
        },
      );
      await this.userModel.findOneAndRemove({ username });
      await this.chatModel.deleteMany({ chatroomid: { $in: chatroomids } });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { error: { status: 500, message: 'Server error' } };
    }
  }

  async updateUserDetails(
    userDetails: updateUserParams,
  ): Promise<returnUserDetailsDto> {
    const { error } = userDetailsValidate(userDetails);
    if (error) {
      return { error };
    }
    const {
      file,
      query: { updatename, updateprofile, removeprofile },
      username,
    } = userDetails;
    try {
      if (updatename) {
        const user = await this.userModel
          .findOneAndUpdate(
            { username },
            { $set: { name: updatename } },
            { new: true },
          )
          .populate('Contacts', 'profile name username gender')
          .populate('Chats.user', 'profile name username gender')
          .populate('Chats.chatInfo', 'lastMessage')
          .select('name profile username Chats Contacts gender');
        return { user };
      } else if (removeprofile) {
        removeUserPic(username);
        const user = await this.userModel
          .findOneAndUpdate(
            { username },
            { $set: { profile: '' } },
            { new: true },
          )
          .populate('Contacts', 'profile name username gender')
          .populate('Chats.user', 'profile name username gender')
          .populate('Chats.chatInfo', 'lastMessage')
          .select('name profile username Chats Contacts gender');
        return { user };
      } else if (updateprofile) {
        const user = await this.userModel
          .findOneAndUpdate(
            { username },
            { $set: { profile: file.path } },
            { new: true },
          )
          .populate('Contacts', 'profile name username gender')
          .populate('Chats.user', 'profile name username gender')
          .populate('Chats.chatInfo', 'lastMessage')
          .select('name profile username Chats Contacts gender');
        return { user };
      }
    } catch (error) {
      return { error: { status: 422, message: 'User not found' } };
    }

    return { error: { status: 500, message: 'Server issue' } };
  }

  async searchUserName(query: searchUserQuery) {
    const { error, user } = searchUserValidate(query);
    if (error) {
      return { error };
    }
    try {
      const regex = new RegExp(user, 'i');
      const users = await this.userModel
        .find({ name: { $regex: regex } })
        .select('name profile username gender');
      return { users };
    } catch (error) {
      return { error: { status: 410, message: 'Users not found' } };
    }
  }
}
