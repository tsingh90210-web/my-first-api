import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // ADD THIS
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 ADD THIS WHOLE BLOCK FOR SWAGGER
  const config = new DocumentBuilder()
    .setTitle('My First API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // URL = /api-docs

  await app.listen(3000);
  console.log(`Server running at http://localhost:3000`);
  console.log(`Swagger docs at http://localhost:3000/api-docs`);
}
bootstrap();
