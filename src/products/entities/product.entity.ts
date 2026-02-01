// src/products/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity'; // Asumiendo que crearás una entidad Category

@Entity('products') // Nombre de la tabla en la DB
export class Product {
  @PrimaryGeneratedColumn('uuid') // Genera un UUID como ID primario
  id: string;

  @Column({ unique: true })
  sku: string; // Stock Keeping Unit (código único del producto)

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number; // Cantidad actual en inventario

  // Relación Many-to-One con Category
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'categoryId' }) // Columna de clave externa en la tabla 'products'
  category: Category;

  @Column({ nullable: true })
  categoryId: string; // ID de la categoría
}
