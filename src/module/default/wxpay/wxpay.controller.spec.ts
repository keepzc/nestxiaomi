import { Test, TestingModule } from '@nestjs/testing';
import { WxpayController } from './wxpay.controller';

describe('WxpayController', () => {
  let controller: WxpayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WxpayController],
    }).compile();

    controller = module.get<WxpayController>(WxpayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
