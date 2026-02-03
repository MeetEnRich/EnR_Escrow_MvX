import { Test, TestingModule } from '@nestjs/testing';
import { EscrowConfigService } from './escrow-config.service';

describe('EscrowConfigService', () => {
  let service: EscrowConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EscrowConfigService],
    }).compile();

    service = module.get<EscrowConfigService>(EscrowConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
