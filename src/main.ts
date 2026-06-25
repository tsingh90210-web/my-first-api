import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
// Add this to prevent startup hangs
logger: ['error', 'warn', 'log', 'debug', 'verbose']
});

// ✅ EXACT PORT FOR CLOUD RUN — use the PORT variable Cloud Run sets
const PORT = parseInt(process.env.PORT || '8080', 10);

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

// ✅ THE MOST CRITICAL LINE: Listen on ALL network interfaces
await app.listen(PORT, '0.0.0.0');
// ✅ Confirm startup clearly
console.log(`
========================================
✅ SERVER STARTED SUCCESSFULLY!
✅ Listening on: 0.0.0.0:${PORT}
✅ Ready to receive traffic!
========================================
`);
}

// Catch any unhandled errors to see what goes wrong
process.on('uncaughtException', (err) => {
console.error('❌ Uncaught Exception:', err);
process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
process.exit(1);
});

bootstrap();
