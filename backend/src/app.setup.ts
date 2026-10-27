import * as dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Use default if setServers is restricted
}

import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

// Shared by the long-running server (main.ts) and the Vercel function (serverless.ts).
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Only our own storefronts may call the API from a browser (keeps old hosted copies out).
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'https://scentivaaura.shop',
      'https://www.scentivaaura.shop',
      /^https:\/\/scentiva-web[a-z0-9-]*\.vercel\.app$/,
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
    ].filter(Boolean) as (string | RegExp)[],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  return app;
}
