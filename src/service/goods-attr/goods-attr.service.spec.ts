import { Test, TestingModule } from '@nestjs/testing';
import { GoodsAttrService } from './goods-attr.service';

describe('GoodsAttrService', () => {
  let service: GoodsAttrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsAttrService],
    }).compile();

    service = module.get<GoodsAttrService>(GoodsAttrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
