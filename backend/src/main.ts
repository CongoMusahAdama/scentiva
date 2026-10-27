import { createApp } from './app.setup';

async function bootstrap() {
  const app = await createApp();

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
