import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = new DocumentBuilder()
.setTitle('PayPal Payment API')
.setDescription('Create and capture payments via PayPal')
.setVersion('1.0')
.addServer('/')
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

app.useStaticAssets(join(__dirname, '..', 'public'));
app.setBaseViewsDir(join(__dirname, '..', 'views'));
app.setViewEngine('hbs');

// ✅ Fix for Cloud Run
const port = parseInt(process.env.PORT || '3000', 10);
await app.listen(port, '0.0.0.0');
console.log(`✅ Server running on port ${port}`);
}
bootstrap();
