import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardsController } from './admin-dashboards.controller';
import { AdminDashboardsService } from './admin-dashboards.service';

describe('AdminDashboardsController', () => {
  let controller: AdminDashboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardsController],
      providers: [AdminDashboardsService],
    }).compile();

    controller = module.get<AdminDashboardsController>(AdminDashboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
