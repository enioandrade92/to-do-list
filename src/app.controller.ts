import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
    @Get('/health_check')
    async healthCheck() {
        return { alive: true };
    }
}
