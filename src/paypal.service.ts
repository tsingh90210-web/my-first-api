import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
private client: paypal.core.PayPalHttpClient;

constructor() {
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = new paypal.core.SandboxEnvironment(clientId!, clientSecret!);
this.client = new paypal.core.PayPalHttpClient(environment);
console.log('PayPal Service Initialized. ID length:', clientId?.length, 'Secret length:', clientSecret?.length);
}

async createOrder(amount: string): Promise<Record<string, unknown> | { error: string }> {
  try {
    const req = new paypal.orders.OrdersCreateRequest();
    req.prefer('return-representation');
    req.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'GBP',
          value: amount
        }
      }],
      application_context: {  
        return_url: 'https://my-first-api-801597296257.europe-west2.run.app/paypal/success',
        cancel_url: 'https://my-first-api-801597296257.europe-west2.run.app/paypal/cancel'
      }
    });
    const response = await this.client.execute(req);
    return response.result;
  } catch (err: unknown) {
    return { error: String(err) };
  }
}
async captureOrder(orderId: string): Promise<Record<string, unknown> | { error: string }> {
  try {
    const req = new paypal.orders.OrdersCaptureRequest(orderId);
    req.requestBody({});
    const response = await this.client.execute(req);
    return response.result;
  } catch (err: unknown) {
    return { error: String(err) };
  }
}
      
