import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DateOnlyInterceptor } from './date-only.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(); // ← вот эта строка!
  app.useGlobalInterceptors(new DateOnlyInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
