import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { CategoriesModule } from './admin/categories/categories.module';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
