import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaypalService } from './paypal.service';
import { PrismaService } from './prisma.service'; // correct import

@Module({
imports: [ConfigModule.forRoot({ isGlobal: true })],
controllers: [PaymentsController],
providers: [PaymentsService, PaypalService, PrismaService], // ONLY ONE LIST HERE
})
export class AppModule {}
