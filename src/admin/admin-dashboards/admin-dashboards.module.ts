import { Module } from '@nestjs/common';
import { AdminDashboardsService } from './admin-dashboards.service';
import { AdminDashboardsController } from './admin-dashboards.controller';

@Module({
  controllers: [AdminDashboardsController],
  providers: [AdminDashboardsService],
})
export class AdminDashboardsModule {}
