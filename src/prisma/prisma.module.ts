import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Global() // This makes Prisma available to EVERY controller automatically
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}