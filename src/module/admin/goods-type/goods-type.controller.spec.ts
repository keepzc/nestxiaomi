import { Test, TestingModule } from '@nestjs/testing';
import { GoodsTypeController } from './goods-type.controller';

describe('GoodsTypeController', () => {
  let controller: GoodsTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsTypeController],
    }).compile();

    controller = module.get<GoodsTypeController>(GoodsTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
