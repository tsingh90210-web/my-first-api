import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// ✅ EXACT PORT FOR CLOUD RUN
const PORT = parseInt(process.env.PORT || '8080', 10);

// ✅ Root redirect
app.use('/', (req, res, next) => {
if (req.path === '/') return res.redirect('/pay');
next();
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger
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

// ✅ CRITICAL: Listen on ALL interfaces + confirm startup
await app.listen(PORT, '0.0.0.0');
console.log(`✅ ======================================`);
console.log(`✅ SERVER STARTED SUCCESSFULLY`);
console.log(`✅ Listening on: 0.0.0.0:${PORT}`);
console.log(`✅ ======================================`);
}

bootstrap();
