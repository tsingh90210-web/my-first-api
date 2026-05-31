import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private readonly client: paypal.core.PayPalHttpClient;
constructor() {
    // HARDCODED - 100% CORRECT KEYS
    const clientId ='Ab9vE1XTKy4XQFRS8jMV-cmCkJ3lDDD2P44tDqt_evpiojcOJj8F-xTRC8dU00zC2oak6PYdUsdAC3F-';
    const clientSecret ='EPzrR1y3BMNz9ZY-7kF9xGcl_2RtFD4ajAJ8I9COXF7V8YfU4slrjZKJZRHNryFLkEhq9tj5cOdEkMYf';

    console.log('=== DEBUG INFO ===');
    console.log('Client ID:', clientId);
    console.log('Client Secret:', clientSecret);
    console.log('Length ID:', clientId.length);
    console.log('Length Secret:', clientSecret.length);

    const env = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    this.client = new paypal.core.PayPalHttpClient(env);
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
cancel_url: 'http://localhost:3000/cancel'
}
});

    return this.client.execute(req).then(r => r.result);
  }

  async captureOrder(orderId: string) {
    const req = new paypal.orders.OrdersCaptureRequest(orderId);
    req.requestBody({});
    return this.client.execute(req).then(r => r.result);
  }
}