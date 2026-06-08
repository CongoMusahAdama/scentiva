import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PRODUCT_SEED_DATA } from './product-seed.data';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  async seedProducts(): Promise<void> {
    try {
      for (const product of PRODUCT_SEED_DATA) {
        await this.productModel.findOneAndUpdate(
          { id: product.id },
          {
            ...product,
            status: product.status ?? 'in-stock',
            costPrice: product.costPrice ?? 0,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }
      console.log(`✅ Seeded ${PRODUCT_SEED_DATA.length} products`);
    } catch (error) {
      console.error('❌ Error seeding products:', error);
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ id }).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.productModel.find({ id: { $in: ids } }).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ id }, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
