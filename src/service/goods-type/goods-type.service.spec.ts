import { Test, TestingModule } from '@nestjs/testing';
import { GoodsTypeService } from './goods-type.service';

describe('GoodsTypeService', () => {
  let service: GoodsTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsTypeService],
    }).compile();

    service = module.get<GoodsTypeService>(GoodsTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
