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
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import { Empty } from "../generated/proto/google/protobuf/empty";

export class UserSessionService implements IUserSessionService {
  async addTicket(request: ReserveTicket): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const ticketServiceClient = new TicketServiceClientImpl(ctx);
    await ctx.inBackground(() =>
      ticketServiceClient.reserve(Ticket.create({ ticketId: request.ticketId }))
    );

    return BoolValue.create({ value: true });
  }

  async checkout(request: CheckoutRequest): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const checkoutClient = new CheckoutServiceClientImpl(ctx);
    const req = CheckoutFlowRequest.create({
      userId: request.userId,
      tickets: ["465"],
    });

    const success = await checkoutClient.checkout(req);

    return BoolValue.create({ value: true });
  }

  async expireTicket(request: ExpireTicketRequest): Promise<Empty> {
    const ctx = restate.useContext(this);

    const ticketServiceClient = new TicketServiceClientImpl(ctx);

    await ctx.inBackground(() =>
      ticketServiceClient.unreserve(
        Ticket.create({ ticketId: request.ticketId })
      )
    );

    return {};
  }
}
