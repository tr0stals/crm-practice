import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DateOnlyInterceptor } from './date-only.interceptor';
import { WsAdapter } from '@nestjs/platform-ws';
import { createDatabaseIfNotExists } from './utils/createDatabaseIfNotExists';
import * as path from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await createDatabaseIfNotExists({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Yoga105!',
    database: 'crm_practice',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalInterceptors(new DateOnlyInterceptor());

  /* TODO: Когда для всех DTO будут прописаны декораторы валидации - раскомментировать. */
  /* На момент коммита декораторы валидации прописаны только для Shipments */
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: false,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  app.useWebSocketAdapter(new WsAdapter(app)); // Важно для чистого ws
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
  console.log('HTTP server running on http://localhost:3000');
  console.log('WebSocket server running on ws://localhost:3001/ws');
}
bootstrap();
