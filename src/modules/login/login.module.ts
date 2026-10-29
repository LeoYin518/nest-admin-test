import { Module } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginController } from './login.controller.js';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
