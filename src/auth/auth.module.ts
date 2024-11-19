import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
