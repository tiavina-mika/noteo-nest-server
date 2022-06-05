import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Res() res): string {
    const test = this.appService.getHello();
    return res.status(HttpStatus.OK).json({
      message: test,
    });
  }
}
