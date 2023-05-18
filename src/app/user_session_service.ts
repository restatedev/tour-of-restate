import * as restate from "@restatedev/restate-sdk";
import {
  CheckoutFlowRequest,
  CheckoutRequest,
  CheckoutServiceClientImpl,
  ExpireTicketRequest,
  ReserveTicket,
  Ticket,
  TicketServiceClientImpl,
  UserSessionService as IUserSessionService,
  UserSessionServiceClientImpl,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import { Empty } from "../generated/proto/google/protobuf/empty";

export class UserSessionService implements IUserSessionService {
  async addTicket(request: ReserveTicket): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const ticketServiceClient = new TicketServiceClientImpl(ctx);
    const success: BoolValue = await ticketServiceClient.reserve(
      Ticket.create({ ticketId: request.ticketId })
    );

    if (success.value) {
      const cart = (await ctx.get<string[]>("cart")) || [];
      cart.push(request.ticketId);
      ctx.set("cart", cart);

      const userSessionClient = new UserSessionServiceClientImpl(ctx);
      const expireTicketRequest = ExpireTicketRequest.create({
        userId: request.userId,
        ticketId: request.ticketId,
      });

      await ctx.inBackground(
        () => userSessionClient.expireTicket(expireTicketRequest),
        15 * 60 * 1000 // delay call for 15 minutes
      );
    }

    return success;
  }

  async checkout(request: CheckoutRequest): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const cart = await ctx.get<string[]>("cart");
    if (cart === null || cart.length === 0) {
      return BoolValue.create({ value: false });
    }

    const checkoutClient = new CheckoutServiceClientImpl(ctx);
    const checkoutFlowReq = CheckoutFlowRequest.create({
      userId: request.userId,
      tickets: cart,
    });
    const success = await checkoutClient.checkout(checkoutFlowReq);

    if (success.value) {
      ctx.clear("cart");
    }
    return success;
  }

  async expireTicket(request: ExpireTicketRequest): Promise<Empty> {
    const ctx = restate.useContext(this);

    const cart = await ctx.get<string[]>("cart");

    if (cart?.find((el) => el === request.ticketId)) {
      const ticketServiceClient = new TicketServiceClientImpl(ctx);
      await ctx.inBackground(() =>
          ticketServiceClient.unreserve(
              Ticket.create({ ticketId: request.ticketId })
          )
      );
      const newCart = cart.filter((el) => el !== request.ticketId);
      ctx.set("cart", newCart);
    }

    return {};
  }
}
