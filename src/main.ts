import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger API Docs setup
  const config = new DocumentBuilder()
    .setTitle('PayPal Payment API')
    .setDescription('Create and capture payments via PayPal')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // ✅ This line tells your server to show your frontend files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Allow browser to connect
  app.enableCors();

  await app.listen(3000);
  console.log('✅ Server running at: http://localhost:3000');
  console.log('📖 API Docs at: http://localhost:3000/api-docs');
}
bootstrap();