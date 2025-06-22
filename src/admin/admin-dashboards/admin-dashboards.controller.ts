import { Controller } from '@nestjs/common';
import { AdminDashboardsService } from './admin-dashboards.service';

@Controller('admin-dashboards')
export class AdminDashboardsController {
  constructor(private readonly adminDashboardsService: AdminDashboardsService) {}
}
