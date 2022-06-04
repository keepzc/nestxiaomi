import { Test, TestingModule } from '@nestjs/testing';
import { PassController } from './pass.controller';

describe('PassController', () => {
  let controller: PassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassController],
    }).compile();

    controller = module.get<PassController>(PassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
