import { Test, TestingModule } from '@nestjs/testing';
import { GoodsTypeAttributeController } from './goods-type-attribute.controller';

describe('GoodsTypeAttributeController', () => {
  let controller: GoodsTypeAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsTypeAttributeController],
    }).compile();

    controller = module.get<GoodsTypeAttributeController>(GoodsTypeAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
