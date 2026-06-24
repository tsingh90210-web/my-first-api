import { Controller, Get, Render, Post, Body, Query, Redirect } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaypalService } from './paypal.service';

@ApiTags('Payments')
@Controller('pay')
export class PaymentsController {
// Temporary storage for current payment details
private currentPayment: { userName: string; amount: number } | null = null;

constructor(
private readonly paymentsService: PaymentsService,
private readonly paypalService: PaypalService,
) {}

@Get()
@ApiOperation({ summary: 'Payment form page' })
@Render('payment')
getPaymentForm() {
return {};
}

@Post('create')
@ApiOperation({ summary: 'Create new PayPal payment order' })
@ApiBody({
description: 'User name and payment amount',
schema: {
type: 'object',
properties: {
userName: { type: 'string', example: 'Paul Hunter', description: 'Full name of the payer' },
amount: { type: 'number', example: 5.00, description: 'Payment amount in GBP' }
},
required: ['userName', 'amount']
}
})
async createOrder(@Body() body: { userName: string; amount: string | number }) {
console.log('📥 Received form data:', body);

try {
const amount = Number(body.amount);
const userName = body.userName || 'Customer';
console.log('💰 Converted amount:', amount, '👤 Name:', userName);

if (isNaN(amount) || amount <= 0) {
console.log('❌ Invalid amount provided');
return { error: 'Please enter a valid amount greater than 0' };
}

// Save details to use later when saving to database
this.currentPayment = { userName, amount };

const result = await this.paypalService.createOrder(amount, 'GBP');
console.log('✅ PayPal order created successfully:', result);
return result;

} catch (fullError) {
console.error('❌ FULL ERROR DETAILS:');
console.error(fullError);
return { error: 'Something went wrong creating your payment' };
}
}

@Post('capture')
@ApiOperation({ summary: 'Capture approved PayPal payment' })
@ApiBody({
description: 'PayPal order ID to capture',
schema: {
type: 'object',
properties: {
orderId: { type: 'string', example: '8WU968379K863424H', description: 'PayPal order ID from approval' }
},
required: ['orderId']
}
})
async capturePayment(@Body() body: { orderId: string }) {
return this.paypalService.captureOrder(body.orderId);
}

@Get('success')
@ApiOperation({ summary: 'Payment success return page' })
@ApiQuery({ name: 'token', required: false, description: 'PayPal approval token / order ID' })
async paymentSuccess(@Query('token') orderId?: string) {
try {
if (!orderId) {
return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#28a745;">✅ Payment Completed</h1>
<p style="font-size:18px; margin-top:20px;">Your payment has been processed successfully.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;
}

// Save payment with actual name and amount from your form
const userName = this.currentPayment?.userName || 'Customer';
const amount = this.currentPayment?.amount || 0;

await this.paymentsService.savePayment(orderId, userName, amount);
console.log('✅ Payment saved to database! Name:', userName, 'Amount:', amount);

// Clear temporary data
this.currentPayment = null;

return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#28a745;">✅ Payment Successful</h1>
<p style="font-size:18px; margin-top:20px;">Thank you! Your payment has been recorded permanently.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;

} catch (err) {
console.error('❌ Error saving payment:', err);
return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#dc3545;">⚠️ Payment Processed</h1>
<p style="font-size:18px; margin-top:20px;">Your payment was successful, and will appear in your history shortly.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;
}
}

@Get('cancel')
@ApiOperation({ summary: 'Payment cancelled page' })
@Render('cancel')
async paymentCancel() {
this.currentPayment = null;
return { message: 'Payment Cancelled' };
}

@Get('dashboard')
@ApiOperation({ summary: 'View all saved payments history' })
@Render('dashboard')
async dashboard() {
const payments = await this.paymentsService.getPaymentHistory();
return { payments };
}
}
