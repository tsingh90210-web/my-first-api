import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// ✅ Correct port for Cloud Run
const port = parseInt(process.env.PORT || '8080', 10);

// ✅ Root redirect
app.use('/', (req, res, next) => {
if (req.path === '/') return res.redirect('/pay');
next();
});

// ✅ Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger setup
const config = new DocumentBuilder()
.setTitle('PayPal Payment API')
.setDescription('Create and capture payments via PayPal')
.setVersion('1.0')
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

// ✅ Static files & views
app.useStaticAssets(join(__dirname, '..', 'public'));
app.setBaseViewsDir(join(__dirname, '..', 'views'));
app.setViewEngine('hbs');

// ✅ THE MOST IMPORTANT LINE: Listen on ALL network interfaces!
await app.listen(port, '0.0.0.0');
console.log(`✅ Server running on port ${port}, ready for Cloud Run!`);
}

bootstrap();
