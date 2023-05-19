import {
  Ticket,
  TicketService as ITicketService,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import { Empty } from "../generated/proto/google/protobuf/empty";

export class TicketService implements ITicketService {
  async reserve(request: Ticket): Promise<BoolValue> {
    return BoolValue.create({ value: true });
  }

  async unreserve(request: Ticket): Promise<Empty> {
    return {};
  }

  async markAsSold(request: Ticket): Promise<Empty> {
    return {};
  }
}
