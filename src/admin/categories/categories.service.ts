import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

import { ExpenseCategory } from '@prisma/client';
import { CreateExpenseCategoryDto } from './dtos/create-categories.dto';
import { UpdateExpenseCategoryDto } from './dtos/update-user.dto';
import { CategoriesResponseDto } from './dtos/categories-response.dto';



@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    //obtener todas las categorias globales
    async getAllGlobalCategories(): Promise<ExpenseCategory[]> {
        return this.prisma.expenseCategory.findMany({
            where: {
                userId: null,
            },
        });
    }

    //crear categoria global
    async createGlobalCategory(data: CreateExpenseCategoryDto): Promise<ExpenseCategory>{
        try {
            return await this.prisma.expenseCategory.create({
                data,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Category already exists');
            }
            throw error;
        }
    }

    //editar categoria global
    async updateGlobalCategory(id: number, data: UpdateExpenseCategoryDto): Promise<ExpenseCategory>{
        if (id <= 0) {
            throw new BadRequestException('Invalid category ID');
          }
      
          try {
            return await this.prisma.expenseCategory.update({
              where: { id },
              data,
            });
          } catch (error) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`Category with ID ${id} not found`);
            }
            throw error;
          }
    }

    //eliminar categoria global
    async deleteGlobalCategory(id: number): Promise<ExpenseCategory>{
        if (id <= 0) {
            throw new BadRequestException('Invalid category ID');
          }
      
          try {
            return await this.prisma.expenseCategory.delete({
              where: { id },
            });
          } catch (error) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`Category with ID ${id} not found`);
            }
            throw error;
          }
    }
}
