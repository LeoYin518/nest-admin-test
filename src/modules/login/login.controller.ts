import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginBody } from './dto/login-body.js';
import { Public } from '../../auth/public.decorator.js';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @Public()
  @Post('')
  doLogin(@Body() loginBody: LoginBody) {
    return this.loginService.doLogin(loginBody)
  }
}
