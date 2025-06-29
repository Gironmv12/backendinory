import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { CategoriesModule } from './admin/categories/categories.module';
import { AdminDashboardsModule } from './admin/admin-dashboards/admin-dashboards.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule, AdminDashboardsModule, UserModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
})],
  controllers: [],
  providers: [],
})
export class AppModule {}
