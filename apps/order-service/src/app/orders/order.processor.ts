import { Processor, Process, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { OrderStatus, constants } from '@ticketing-app/nest-common';
import { OrdersService } from './orders.service';

@Processor({
  name: constants.EXPIRE_ORDER,
})
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    private readonly orderService: OrdersService,
    private readonly orm: MikroORM
  ) {}

  @Process('expireOrder')
  async expireOrder(job: Job<{ orderId: string }>) {
    await this.handleExpireOrder(job.data.orderId);
  }

  @CreateRequestContext()
  async handleExpireOrder(orderId: string) {
    // this will be executed in a separate context
    this.logger.log(`handle expire order: ${orderId}`);

    return this.orderService.update(orderId, { status: OrderStatus.EXPIRED });
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      { data: job.data },
      `Processing job ${job.id} of type ${job.name}`
    );
  }

  @OnQueueError()
  onError(error) {
    this.logger.error(error);
  }
}
