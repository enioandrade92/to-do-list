import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health_check')
  async healthCheck() {
    return { alive: true };
  }
}
