import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
private readonly environment: paypal.core.Environment;

constructor(private configService: ConfigService) {
const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID')!;
const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET')!;
const mode = this.configService.get<string>('PAYPAL_MODE', 'sandbox');

this.environment = mode === 'live'
? new paypal.core.LiveEnvironment(clientId, clientSecret)
: new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

get client(): paypal.core.PayPalHttpClient {
return new paypal.core.PayPalHttpClient(this.environment);
}

async createOrder(amount: number, currency = 'GBP'): Promise<{ approvalUrl: string; orderId: string }> {
const request = new paypal.orders.OrdersCreateRequest();
request.prefer('return=representation');
request.requestBody({
intent: 'CAPTURE',
purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) } }],
application_context: {
return_url: 'http://localhost:3000/pay/success',
cancel_url: 'http://localhost:3000/pay/cancel'
}
});
const order = await this.client.execute(request);
const approvalUrl = order.result.links.find(l => l.rel === 'approve')?.href;
if (!approvalUrl) throw new Error('No approval URL');
return { approvalUrl, orderId: order.result.id };
}

async captureOrder(orderId: string): Promise<boolean> {
const request = new paypal.orders.OrdersCaptureRequest(orderId);
const capture = await this.client.execute(request);
return capture.result.status === 'COMPLETED';
}
}