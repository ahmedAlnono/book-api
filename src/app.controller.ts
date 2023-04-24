import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth, Signin } from './dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signin')
  getHello(@Body() dto: Signin, @Res() res: Response) {
    return this.appService.signin(dto, res);
  }

  @Post('signup')
  signup(@Body() dto: Auth, @Res() res: Response) {
    return this.appService.signup(dto, res);
  }
}
