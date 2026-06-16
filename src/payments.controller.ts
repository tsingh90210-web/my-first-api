import {
Controller, Post, Body, Param, Patch, Get, Query, Render,
HttpStatus, HttpException
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaypalService } from './paypal.service';
import { Decimal } from '@prisma/client/runtime/library';

class CreatePaymentDto {
userName: string;
amount: number;
}

class UpdateStatusDto {
status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

class CapturePaymentDto {
orderId: string;
}

@Controller('pay')
export class PaymentsController {
constructor(
private readonly prisma: PrismaService,
private readonly paypalService: PaypalService
) {}

@Post('create')
@ApiOperation({ summary: 'Create payment and get PayPal link' })
@ApiBody({ type: CreatePaymentDto })
@ApiResponse({ status: 201, description: 'Payment created' })
async createPayment(@Body() body: CreatePaymentDto) {
try {
if (!body.userName || !body.amount || body.amount <= 0) {
throw new HttpException('Valid name and amount required', HttpStatus.BAD_REQUEST);
}
const { approvalUrl, orderId } = await this.paypalService.createOrder(body.amount);
const payment = await this.prisma.payment.create({
data: {
userName: body.userName,
amount: new Decimal(body.amount),
status: 'PENDING',
currency: 'GBP',
paypalOrderId: orderId,
approvalUrl: approvalUrl
}
});
return { success: true, paymentId: payment.id, orderId, approvalUrl };
} catch (err) {
throw new HttpException((err as Error).message || 'Failed', HttpStatus.BAD_REQUEST);
}
}

@Patch(':id/status')
@ApiOperation({ summary: 'Update payment status' })
@ApiParam({ name: 'id' })
@ApiBody({ type: UpdateStatusDto })
async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
try {
const updated = await this.prisma.payment.update({
where: { id: Number(id) },
data: { status: body.status }
});
return { success: true, payment: updated };
} catch {
throw new HttpException('Not found', HttpStatus.NOT_FOUND);
}
}

@Post('capture')
@ApiOperation({ summary: 'Capture PayPal payment' })
@ApiBody({ type: CapturePaymentDto })
async capturePayment(@Body() body: CapturePaymentDto) {
try {
const captured = await this.paypalService.captureOrder(body.orderId);
if (!captured) throw new Error('Capture failed');
await this.prisma.payment.updateMany({
where: { paypalOrderId: body.orderId },
data: { status: 'COMPLETED' }
});
return { success: true, message: 'Payment completed' };
} catch (err) {
throw new HttpException((err as Error).message, HttpStatus.BAD_REQUEST);
}
}

@Get('success')
@ApiOperation({ summary: 'Payment success return' })
@ApiQuery({ name: 'token' })
async paymentSuccess(@Query('token') orderId?: string) {
if (!orderId) return '<h1>Missing reference</h1><p><a href="/pay/dashboard">Go to Dashboard</a></p>';
try {
const captured = await this.paypalService.captureOrder(orderId);
if (captured) {
await this.prisma.payment.updateMany({ where: { paypalOrderId: orderId }, data: { status: 'COMPLETED' } });
return '<h1>✅ Payment Successful!</h1><p>Thank you.</p><p><a href="/pay/dashboard">View Dashboard</a></p>';
}
return '<h1>⚠️ Could not confirm</h1><p><a href="/pay/dashboard">Back</a></p>';
} catch {
return '<h1>❌ Error</h1><p><a href="/payments/dashboard">Back</a></p>';
}
}

@Get('cancel')
@ApiOperation({ summary: 'Payment cancelled' })
async paymentCancel() {
return '<h1>❌ Payment Cancelled</h1><p><a href="/">Try again</a> | <a href="/pay/dashboard">Dashboard</a></p>';
}

@Get('dashboard')
@Render('dashboard')
@ApiOperation({ summary: 'View all payments' })
async showDashboard() {
const payments = await this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' } });
return { payments };
}

@Get()
@Render('payment')
@ApiOperation({ summary: 'Show payment form' })
async showForm() {
return {};
}
}