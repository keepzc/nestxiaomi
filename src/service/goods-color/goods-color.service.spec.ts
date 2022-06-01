import { Test, TestingModule } from '@nestjs/testing';
import { GoodsColorService } from './goods-color.service';

describe('GoodsColorService', () => {
  let service: GoodsColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsColorService],
    }).compile();

    service = module.get<GoodsColorService>(GoodsColorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
