import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
private client: paypal.core.PayPalHttpClient;

constructor() {
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
this.client = new paypal.core.PayPalHttpClient(environment);
console.log('PayPal Service Initialized. ID length:', clientId?.length, 'Secret length:', clientSecret?.length);
}

async createOrder(amount: string) {
const req = new paypal.orders.OrdersCreateRequest();
req.prefer('return=representation');
req.requestBody({
intent: 'CAPTURE',
purchase_units: [{
amount: {
currency_code: 'GBP',
value: amount
}
}],
application_context: {
return_url: 'http://localhost:3000/paypal/success',
cancel_url: 'http://localhost:3000/paypal/cancel'
}
});
const response = await this.client.execute(req);
return response.result;
}

async captureOrder(orderId: string) {
const req = new paypal.orders.OrdersCaptureRequest(orderId);
req.requestBody({});
const response = await this.client.execute(req);
return response.result;
}
}