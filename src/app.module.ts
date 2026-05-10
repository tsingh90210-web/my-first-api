import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module'; // Import our new module

@Module({
  imports: [PrismaModule], // Register the Prisma module
})
export class AppModule {}
