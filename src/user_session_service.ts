import * as restate from "@restatedev/restate-sdk";
import {
  CheckoutRequest,
  ExpireTicketRequest,
  protoMetadata,
  ReserveTicket,
  UserSessionService,
} from "./generated/proto/example";
import { BoolValue } from "./generated/proto/google/protobuf/wrappers";
import { Empty } from "./generated/proto/google/protobuf/empty";

class UserSessionSvc implements UserSessionService {
  async addTicket(request: ReserveTicket): Promise<BoolValue> {
    return Promise.resolve(BoolValue.create({ value: true }));
  }

  async checkout(request: CheckoutRequest): Promise<BoolValue> {
    return Promise.resolve(BoolValue.create({ value: true }));
  }

  async expireTicket(request: ExpireTicketRequest): Promise<Empty> {
    return Promise.resolve(BoolValue.create({ value: true }));
  }
}

restate.createServer().bindService({
  service: "UserSessionService",
  instance: new UserSessionSvc(),
  descriptor: protoMetadata,
}).listen(8080);
