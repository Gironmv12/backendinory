import { IsNotEmpty, IsEnum, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export enum ExpenseType {
  FIJO = 'FIJO',
  VARIABLE = 'VARIABLE',
  IMPREVISTO = 'IMPREVISTO'
}

export class CreateExpenseCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
