import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({ credentials: false, origin: true });

  // створюємо midleware, який буде слідкувати за адресою /uploads. 
  // Якщо за цією адресою хтось перейде, то потрібно звернутись до статики з папки uploads
  // NestJS під капотом працює ч-з express
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('Cloud storage')
    .setDescription('New project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });

  await app.listen(1313);
}

bootstrap();
