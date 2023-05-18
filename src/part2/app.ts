import * as restate from "@restatedev/restate-sdk";
import { protoMetadata } from "../generated/proto/example";
import { TicketService } from "./ticket_service";
import { UserSessionService } from "./user_session_service";
import { CheckoutService } from "./checkout_service";

restate
  .createServer()
  .bindService({
    descriptor: protoMetadata,
    service: "TicketService",
    instance: new TicketService(),
  })
  .bindService({
    descriptor: protoMetadata,
    service: "UserSessionService",
    instance: new UserSessionService(),
  })
  .bindService({
    descriptor: protoMetadata,
    service: "CheckoutService",
    instance: new CheckoutService(),
  })
  .listen(8080);
