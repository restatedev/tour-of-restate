import * as restate from "@restatedev/restate-sdk";
import {
  protoMetadata,
  Ticket,
  TicketService,
} from "./generated/proto/example";
import { BoolValue } from "./generated/proto/google/protobuf/wrappers";
import { Empty } from "./generated/proto/google/protobuf/empty";

class TicketSvc implements TicketService {
  async markAsSold(request: Ticket): Promise<Empty> {
    return Promise.resolve(Empty.create({}));
  }

  async reserve(request: Ticket): Promise<BoolValue> {
    return Promise.resolve(BoolValue.create({}));
  }

  async unreserve(request: Ticket): Promise<Empty> {
    return Promise.resolve(BoolValue.create({}));
  }
}

restate.createServer().bindService({
  service: "TicketService",
  instance: new TicketSvc(),
  descriptor: protoMetadata,
}).listen(8082);
