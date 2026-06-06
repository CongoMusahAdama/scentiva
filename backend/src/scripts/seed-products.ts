import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const productsService = app.get(ProductsService);
  await productsService.seedProducts();
  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ Product seed failed:', error);
  process.exit(1);
});
