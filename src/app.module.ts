import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaypalController } from './paypal.controller';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    PrismaModule
  ],
  controllers: [PaypalController, PaymentsController],
  providers: []
})
export class AppModule {}