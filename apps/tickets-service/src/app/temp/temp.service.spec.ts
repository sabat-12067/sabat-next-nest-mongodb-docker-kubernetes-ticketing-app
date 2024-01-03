import { Test, TestingModule } from '@nestjs/testing';
import { TempService } from './temp.service';

describe('TempService', () => {
  let service: TempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempService],
    }).compile();

    service = module.get<TempService>(TempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
