import { Test, TestingModule } from '@nestjs/testing';
import { TempController } from './temp.controller';
import { TempService } from './temp.service';

describe('TempController', () => {
  let controller: TempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempController],
      providers: [TempService],
    }).compile();

    controller = module.get<TempController>(TempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
