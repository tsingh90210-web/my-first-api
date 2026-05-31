import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { SupabaseService } from './supabase/supabase.service';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [PaypalController],
  providers: [PrismaService, SupabaseService, PaypalService],
})
export class AppModule {}