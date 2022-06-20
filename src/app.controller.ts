import { Controller, Get, MessageEvent, Res, Sse, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    throw new UnauthorizedException();
  }
}
