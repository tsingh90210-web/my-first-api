import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('paypal')
export class PaypalController {
  constructor(private prisma: PrismaService) {}

  @Post('create')
  async createPayment(@Body() body: { userName: string; amount: number }) {
    try {
      // Save payment exactly like the dashboard does
      const payment = await this.prisma.payment.create({
        data: {
          userName: body.userName,
          amount: new Decimal(body.amount),
          status: 'PENDING',
          currency: 'GBP'
        }
      });

      return {
        success: true,
        approvalUrl: '/dashboard'
      };

    } catch (err) {
      console.error('🔥 SERVER ERROR:', err);
      throw new Error('Payment failed');
    }
  }
}