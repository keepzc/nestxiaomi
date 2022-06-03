import { Test, TestingModule } from '@nestjs/testing';
import { GoodsImageService } from './goods-image.service';

describe('GoodsImageService', () => {
  let service: GoodsImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsImageService],
    }).compile();

    service = module.get<GoodsImageService>(GoodsImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
