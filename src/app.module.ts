import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { CategoriesModule } from './admin/categories/categories.module';
import { AdminDashboardsModule } from './admin/admin-dashboards/admin-dashboards.module';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule, AdminDashboardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
