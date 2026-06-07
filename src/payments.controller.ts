import { Controller, Get, Render } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('dashboard')
export class PaymentsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Render('dashboard')
  async showDashboard() {
    const payments = await this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { payments };
  }
}