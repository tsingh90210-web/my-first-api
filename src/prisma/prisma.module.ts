import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes this module available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Expose the service so other modules can use it
})
export class PrismaModule {}