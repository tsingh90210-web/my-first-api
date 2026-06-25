import { Injectable } from '@nestjs/common';
import paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
private client: any;

constructor(private configService: ConfigService) {
const clientId = this.configService.get('PAYPAL_CLIENT_ID');
const clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');

console.log('🔑 PayPal Client ID loaded:', !!clientId);
console.log('🔑 PayPal Client Secret loaded:', !!clientSecret);

if (!clientId || !clientSecret) {
throw new Error('❌ PayPal credentials NOT FOUND in .env file!');
}

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
this.client = new paypal.core.PayPalHttpClient(environment);
}

async createOrder(amount: number, currency: string = 'GBP') {
const request = new paypal.orders.OrdersCreateRequest();
request.prefer('return=representation');
request.requestBody({
intent: 'CAPTURE',
purchase_units: [{
amount: {
currency_code: currency,
value: amount.toFixed(2)
}
}],
application_context: {
return_url: 'https://my-first-api-801597296257.europe-west2.run.app/pay/success',
cancel_url: 'https://my-first-api-801597296257.europe-west2.run.app/pay/cancel',
}
});

const response = await this.client.execute(request);
const approvalLink = response.result.links.find((link: any) => link.rel === 'approve');
return {
approvalUrl: approvalLink.href,
orderId: response.result.id
};
}

async captureOrder(orderId: string) {
const request = new paypal.orders.OrdersCaptureRequest(orderId);
request.requestBody({});
const response = await this.client.execute(request);
return response.result;
}
}
