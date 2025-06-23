import { PartialType } from "@nestjs/mapped-types";
import { CreateExpenseCategoryDto } from "./create-categories.dto";

export class UpdateExpenseCategoryDto extends PartialType(CreateExpenseCategoryDto) {}