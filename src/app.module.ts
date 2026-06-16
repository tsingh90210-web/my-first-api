import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PaymentsController } from './payments.controller';
import { PaypalService } from './paypal.service';

@Module({
imports: [ConfigModule.forRoot({ isGlobal: true })],
controllers: [PaymentsController],
providers: [PrismaService, PaypalService],
})
export class AppModule {}