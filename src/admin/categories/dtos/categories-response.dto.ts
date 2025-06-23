import {ExpenseType} from "./create-categories.dto";

export class CategoriesResponseDto {
    id: number;
    name: string;
    type: ExpenseType;
    description: string;
    userId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
