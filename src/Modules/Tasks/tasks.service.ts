import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { Jwt } from 'src/data/refreshTokens';
import { chatModelDto } from 'src/Models/dto/chatmodel.dto';
import { UserModelDto } from 'src/Models/dto/user.dto';
import { removeMessagePics } from 'src/utils/remove.folder.utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(CHATDOCUMENT) private chatModel: Model<chatModelDto>,
    @InjectModel(USERDOCUMENT) private userModel: Model<UserModelDto>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_2_HOURS)
  handleRemoveTokens() {
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
    this.logger.warn({
      totalRecords: alltokens.length,
      errors,
      success,
    });
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async removeEverything() {
    try {
      removeMessagePics();
      await this.chatModel.updateMany(
        {},
        { $set: { messages: [], lastMessage: { sender: '', message: '' } } },
      );
      await this.userModel.updateMany(
        { 'Chats.unseenMessages': { $gte: 1 } },
        { $set: { 'Chats.$.unseenMessages': 0 } },
      );
      this.logger.warn('Succesfully removed all the messages');
    } catch (error) {
      this.logger.error('Some error occur didnt remove messages');
    }
  }
}
