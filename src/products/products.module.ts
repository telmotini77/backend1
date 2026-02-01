import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Registra la entidad Product para este módulo
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
