import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express'; // ← this import is required

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// ✅ THESE 2 LINES FIX EVERYTHING — missing = your error
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const config = new DocumentBuilder()
.setTitle('PayPal Payment API')
.setDescription('Create and capture payments via PayPal')
.setVersion('1.0')
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

// Frontend
app.useStaticAssets(join(__dirname, '..', 'public'));
app.setBaseViewsDir(join(__dirname, '..', 'views'));
app.setViewEngine('hbs');

app.enableCors();

await app.listen(3000);
console.log(`✅ Server running at: http://localhost:3000`);
}
bootstrap();