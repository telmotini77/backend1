import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() @IsOptional() description?: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
  @IsUUID() @IsNotEmpty() categoryId: string; // Asocia el producto a una categoría existente
}
