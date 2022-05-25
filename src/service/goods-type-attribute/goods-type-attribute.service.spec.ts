import { Test, TestingModule } from '@nestjs/testing';
import { GoodsTypeAttributeService } from './goods-type-attribute.service';

describe('GoodsTypeAttributeService', () => {
  let service: GoodsTypeAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsTypeAttributeService],
    }).compile();

    service = module.get<GoodsTypeAttributeService>(GoodsTypeAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
