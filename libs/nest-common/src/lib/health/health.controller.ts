import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  MikroOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { Public } from '../auth/auth.guard';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mikro: MikroOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.mikro.pingCheck('database')]);
  }
}
