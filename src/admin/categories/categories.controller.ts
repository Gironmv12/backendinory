import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ExpenseCategory } from '@prisma/client';
import { CreateExpenseCategoryDto } from './dtos/create-categories.dto';
import { UpdateExpenseCategoryDto } from './dtos/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('expense-categories')
@Controller('/admin/expense-categories/global')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all global expense categories' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved global expense categories' })
  async getAllGlobalCategories(): Promise<Partial<ExpenseCategory>[]> {
    return this.categoriesService.getAllGlobalCategories();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new global expense category' })
  @ApiResponse({ status: 201, description: 'Global expense category created successfully' })
  @ApiBody({
    type: CreateExpenseCategoryDto,
    description: 'Global expense category creation data',
    examples: {
      example1: {
        summary: 'Example global expense category creation',
        value: {
          name: 'Food',
          type: 'EXPENSE',
          description: 'Food expenses',
          userId: null,
          isActive: true
        }
      }
    }
  })
  async createGlobalCategory(@Body() data: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    return this.categoriesService.createGlobalCategory(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update global expense category' })
  @ApiResponse({ status: 200, description: 'Global expense category updated successfully' })
  @ApiResponse({ status: 404, description: 'Global expense category not found' })
  @ApiParam({ name: 'id', description: 'Global expense category ID', type: 'integer' })
  @ApiBody({
    type: UpdateExpenseCategoryDto,
    description: 'Global expense category update data',
    examples: {
      example1: {
        summary: 'Example global expense category update',
        value: {
          name: 'Food',
          type: 'EXPENSE',
          description: 'Food expenses',
          userId: null,
          isActive: true
        }
      }
    }
  })
  async updateGlobalCategory(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
    return this.categoriesService.updateGlobalCategory(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete global expense category' })
  @ApiResponse({ status: 204, description: 'Global expense category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Global expense category not found' })
  @ApiParam({ name: 'id', description: 'Global expense category ID', type: 'integer' })
  @HttpCode(204)
  async deleteGlobalCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriesService.deleteGlobalCategory(id);
  }
}
