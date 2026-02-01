import { PartialType } from '@nestjs/mapped-types'; // Necesitarás instalar @nestjs/mapped-types
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

// PartialType hace que todas las propiedades de CreateProductDto sean opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // Puedes añadir validaciones específicas para la actualización si es necesario
  // Por ejemplo, si quieres permitir actualizar solo el stock sin cambiar otros campos
  @IsNumber() @IsOptional() @Min(0) stock?: number;
}
