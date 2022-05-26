import { Test, TestingModule } from '@nestjs/testing';
import { GoodsCateService } from './goods-cate.service';

describe('GoodsCateService', () => {
  let service: GoodsCateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsCateService],
    }).compile();

    service = module.get<GoodsCateService>(GoodsCateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
