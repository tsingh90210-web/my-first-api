import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { SupabaseService } from './supabase/supabase.service';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, PaypalController],
  providers: [PrismaService, SupabaseService, PaypalService],
})
export class AppModule {}
