import {
  CheckoutFlowRequest,
  CheckoutService as ICheckoutService,
  Ticket,
  TicketServiceClientImpl,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import * as restate from "@restatedev/restate-sdk";
import { v4 as uuid } from "uuid";
import { StripeClient } from "../aux/stripe_client";
import { RestateUtils } from "@restatedev/restate-sdk";
import { EmailClient } from "../aux/email_client";

export class CheckoutService implements ICheckoutService {
  async checkout(request: CheckoutFlowRequest): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const idempotencyKey = await ctx.sideEffect<string>(async () => uuid());

    const amount = request.tickets.length * 40;

    const stripe = StripeClient.get();
    const doPayment = async () => stripe.call(idempotencyKey, amount);
    const success: boolean =
      await RestateUtils.retryExceptionalSideEffectWithBackoff(
        ctx,
        doPayment,
        100,
        500,
        5
      );

    const ticketServiceClient = new TicketServiceClientImpl(ctx);
    const emailClient = EmailClient.get();

    if (success) {
      for await (const ticketId of request.tickets) {
        await ctx.inBackground(() =>
          ticketServiceClient.markAsSold(Ticket.create({ ticketId: ticketId }))
        );
      }
      await ctx.sideEffect<boolean>(async () =>
        emailClient.notifyUserOfPaymentSuccess(request.userId)
      );
    } else {
      for await (const ticketId of request.tickets) {
        await ctx.inBackground(() =>
          ticketServiceClient.unreserve(Ticket.create({ ticketId: ticketId }))
        );
      }
      await ctx.sideEffect<boolean>(async () =>
        emailClient.notifyUserOfPaymentFailure(request.userId)
      );
    }

    return BoolValue.create({ value: success });
  }
}
