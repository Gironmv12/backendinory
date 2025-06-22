import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardsService } from './admin-dashboards.service';

describe('AdminDashboardsService', () => {
  let service: AdminDashboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDashboardsService],
    }).compile();

    service = module.get<AdminDashboardsService>(AdminDashboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
