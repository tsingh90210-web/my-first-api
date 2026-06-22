import { Controller, Post, Body, HttpStatus, HttpException, Get, Render, Query, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaypalService } from './paypal.service';
import { PrismaService } from './prisma/prisma.service';
class CreatePaymentDto {
    userName?: string;
    amount: number;
}
class UpdatePaymentStatusDto {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}
@ApiTags('payments')
@Controller('pay')
export class PaymentsController {
constructor(
private readonly paypalService: PaypalService,
private readonly prisma: PrismaService,
) {}

@Post('create')
@ApiOperation({ summary: 'Create payment and get PayPal link' })
@ApiResponse({ status: 201, description: 'Payment created' })
async createPayment(@Body() body: CreatePaymentDto) {
try {
if (!body.amount || Number(body.amount) <= 0) {
throw new HttpException('Valid amount required', HttpStatus.BAD_REQUEST);
}
const userName = body.userName || 'Guest User';
const { approvalUrl, orderId } = await this.paypalService.createOrder(body.amount);

// DB call disabled for now
return { success: true, orderId, approvalUrl };

} catch (err) {
throw new HttpException((err as Error).message || 'Failed', HttpStatus.BAD_REQUEST);
}
}

@Patch(':id/status')
@ApiOperation({ summary: 'Update payment status' })
@ApiParam({ name: 'id', description: 'PayPal Order ID' })
@ApiBody({ type: UpdatePaymentStatusDto })
@ApiResponse({ status: 200, description: 'Status updated' })
async updatePaymentStatus(@Param('id') orderId: string, @Body() body: UpdatePaymentStatusDto) {
// DB call disabled for now
return { success: true, orderId, status: body.status };
}

@Post('capture')
@ApiOperation({ summary: 'Capture approved payment' })
@ApiResponse({ status: 200, description: 'Payment captured' })
async capturePayment(@Body() body: { orderId: string }) {
try {
const captured = await this.paypalService.captureOrder(body.orderId);
if (!captured) throw new HttpException('Capture failed', HttpStatus.BAD_REQUEST);

// DB call disabled for now
return { success: true, message: 'Payment completed' };

} catch (err) {
throw new HttpException((err as Error).message, HttpStatus.BAD_REQUEST);
}
}


@Get('success')
@ApiOperation({ summary: 'Payment success return' })
@ApiQuery({ name: 'token', required: false })
async paymentSuccess(@Query('token') orderId?: string) {
try {
if (!orderId) {
return `<h1>✅ Payment Completed</h1><p><a href="/pay/dashboard">View Dashboard</a></p>`;
}
await this.paypalService.captureOrder(orderId);
return `<h1>✅ Payment Successful</h1><p>Thank you!<br/><a href="/pay/dashboard">View Dashboard</a></p>`;
} catch {
return `<h1>❌ Payment Error</h1><p><a href="/pay/dashboard">Back to Dashboard</a></p>`;
}
}
@Get('cancel')
@Render('cancel')
@ApiOperation({ summary: 'Payment cancelled' })
async paymentCancel() {
return `<h1>❌ Payment Cancelled</h1><p><a href="/">Try again</a> | <a href="/pay/dashboard">Dashboard</a></p>`;
}

@Get('dashboard')
@Render('dashboard')
@ApiOperation({ summary: 'View all payments' })
async showDashboard() {
// Empty list, no DB call
const payments: any[] = [];
return { payments };
}

@Get()
@Render('payment')
@ApiOperation({ summary: 'Show payment form' })
async showForm() {
return {};
}
}
