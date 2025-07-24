import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DateOnlyInterceptor } from './date-only.interceptor';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalInterceptors(new DateOnlyInterceptor());
  app.useWebSocketAdapter(new WsAdapter(app)); // Важно для чистого ws
  await app.listen(process.env.PORT ?? 3000);
  console.log('HTTP server running on http://localhost:3000');
  console.log('WebSocket server running on ws://localhost:3001/ws');
}
bootstrap();
