import { Test, TestingModule } from '@nestjs/testing';
import { NavService } from './nav.service';

describe('NavService', () => {
  let service: NavService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NavService],
    }).compile();

    service = module.get<NavService>(NavService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
