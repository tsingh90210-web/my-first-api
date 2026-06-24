import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);
const port = process.env.PORT || 8080;

app.use('/', (req, res, next) => {
    if (req.path === '/') return res.redirect('/pay');
    next ();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger API Docs setup
const config = new DocumentBuilder()
.setTitle('PayPal Payment API')
.setDescription('Create and capture payments via PayPal')
.setVersion('1.0')
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

// ✅ Views & static files
app.useStaticAssets(join(__dirname, '..', 'public'));
app.setBaseViewsDir(join(__dirname, '..', 'views'));
app.setViewEngine('hbs');

await app.listen(port, '0.0.0.0');
console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();