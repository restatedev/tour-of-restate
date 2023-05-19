import {
  CheckoutRequest,
  ExpireTicketRequest,
  ReserveTicket,
  UserSessionService as IUserSessionService,
} from "../generated/proto/example";
import { BoolValue } from "../generated/proto/google/protobuf/wrappers";
import { Empty } from "../generated/proto/google/protobuf/empty";

export class UserSessionService implements IUserSessionService {
  async addTicket(request: ReserveTicket): Promise<BoolValue> {
    return BoolValue.create({ value: true });
  }

  async checkout(request: CheckoutRequest): Promise<BoolValue> {
    return BoolValue.create({ value: true });
  }

  async expireTicket(request: ExpireTicketRequest): Promise<Empty> {
    return {};
  }
}
