import { Test, TestingModule } from '@nestjs/testing';
import { GoodsCateController } from './goods-cate.controller';

describe('GoodsCateController', () => {
  let controller: GoodsCateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsCateController],
    }).compile();

    controller = module.get<GoodsCateController>(GoodsCateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
