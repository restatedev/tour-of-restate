import * as restate from "@restatedev/restate-sdk";
import {
  Ticket,
  TicketService as ITicketService,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import { Empty } from "../generated/proto/google/protobuf/empty";

export class TicketService implements ITicketService {
  async reserve(request: Ticket): Promise<BoolValue> {
    const ctx = restate.useContext(this);

    const ticketStatus = await ctx.get<string>("ticket_status");

    if (!ticketStatus || ticketStatus === "AVAILABLE") {
      ctx.set("ticket_status", "RESERVED");
      return BoolValue.create({ value: true });
    } else {
      return BoolValue.create({ value: false });
    }
  }

  async unreserve(request: Ticket): Promise<Empty> {
    const ctx = restate.useContext(this);

    ctx.set("ticket_status", "AVAILABLE");

    return {};
  }

  async markAsSold(request: Ticket): Promise<Empty> {
    const ctx = restate.useContext(this);

    ctx.set("ticket_status", "SOLD");

    return {};
  }
}
