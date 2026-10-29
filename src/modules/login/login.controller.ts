import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginBody } from './dto/login-body.js';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @Post('')
  doLogin(@Body() loginBody: LoginBody) {
    return this.loginService.doLogin(loginBody)
  }
}
