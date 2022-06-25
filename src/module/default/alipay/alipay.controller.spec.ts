import { Test, TestingModule } from '@nestjs/testing';
import { AlipayController } from './alipay.controller';

describe('AlipayController', () => {
  let controller: AlipayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlipayController],
    }).compile();

    controller = module.get<AlipayController>(AlipayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
