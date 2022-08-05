import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USERDOCUMENT } from 'src/constants/mongoose.documents';
import { Userschema } from 'src/Models/UserModel.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USERDOCUMENT, schema: Userschema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
