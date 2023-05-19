let i = 0;
export class StripeClient {
  public static get() {
    return new StripeClient();
  }
  async call(idempotencyKey: string, amount: number): Promise<boolean> {
    console.log(
      `Stripe call succeeded for idempotency key ${idempotencyKey} and amount ${amount}`
    );
    // do the call
    return true;
  }

  async failingCall(idempotencyKey: string, amount: number): Promise<boolean> {
    if (i >= 2) {
      console.log(
        `Stripe call succeeded for idempotency key ${idempotencyKey} and amount ${amount}`
      );
      i = 0;
      return true;
    } else {
      console.log(
        `Stripe call failed for idempotency key ${idempotencyKey} and amount ${amount}. Retrying...`
      );
      i = i + 1;
      throw new Error("Stripe call failed");
    }
  }
}
