import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private readonly userSelect = {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      };

    // Listar todos los usuarios
    async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany({
          select: this.userSelect,
        });
      }

    // Buscar un usuario por ID
    async getUserById(id: number): Promise<User> {
        if (id <= 0) {
            throw new BadRequestException('Invalid user ID');
          }
      
          const user = await this.prisma.user.findUnique({
            where: { id },
            select: this.userSelect,
          });
      
          if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
          }
      
          return user;
    }

    //ver detalles de un usuario
    async getUserDetails(id: number): Promise<User> {
        if (id <= 0) {
            throw new BadRequestException('Invalid user ID');
          }
        const user = await this.prisma.user.findUnique({ where: { id } ,
        include: {
            incomes: true,
            expenses: true,
            budgets: true,
            incomeSources: true,    
            expenseCategories: true,
        }});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    //crear un usuario
    async createUser(data: CreateUserDto): Promise<User> {
        try {
            return await this.prisma.user.create({
              data,
            });
          } catch (error) {
            if (error.code === 'P2002') {
              throw new ConflictException('Email already exists');
            }
            throw error;
          }
    }

    //actualizar un usuario
    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        if (id <= 0) {
            throw new BadRequestException('Invalid user ID');
          }
      
          try {
            return await this.prisma.user.update({
              where: { id },
              data,
              select: this.userSelect,
            });
          } catch (error) {
            throw error;
          }
    }

    //eliminar un usuario
    async deleteUser(id: number): Promise<User> {
        if (id <= 0) {
            throw new BadRequestException('Invalid user ID');
          }
      
          try {
            return await this.prisma.user.delete({
              where: { id },
              select: this.userSelect,
            });
          } catch (error) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`User with ID ${id} not found`);
            }
            throw error;
          }
    }
}
