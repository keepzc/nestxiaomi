import { Test, TestingModule } from '@nestjs/testing';
import { UserTempService } from './user-temp.service';

describe('UserTempService', () => {
  let service: UserTempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTempService],
    }).compile();

    service = module.get<UserTempService>(UserTempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
