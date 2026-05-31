import { ApiKeyGuard } from './api-key.guard';
import { UseGuards } from '@nestjs/common';
import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create')
  create(@Body() body: { amount: string }) {
    return this.paypalService.createOrder(body.amount);
  }

  @Post('capture/:id')
  capture(@Param('id') id: string) {
    return this.paypalService.captureOrder(id);
  }
  @Get('success')
async success(@Query('token') token: string, @Query('PayerID') payerId: string) {
const result = await this.paypalService.captureOrder(token);
return { message: 'Payment successful!', result };
}
}