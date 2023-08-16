/*
 * Copyright (c) 2023 - Restate Software, Inc., Restate GmbH
 *
 * This file is part of the Tour of Restate Typescript handler API,
 * which is released under the MIT license.
 *
 * You can find a copy of the license in the file LICENSE
 * in the root directory of this repository or package or at
 * https://github.com/restatedev/tour-of-restate-typescript-handler
 */

import * as restate from "@restatedev/restate-sdk";
import { setTimeout } from "timers/promises";

enum _TicketStatus {
  Available,
  Reserved,
  Sold,
}

const doReserveTicket = async (_ctx: restate.RpcContext) => {
  await setTimeout(35000);
  return true;
};

const doUnreserveTicket = async (_ctx: restate.RpcContext) => {
  return true;
};

const doMarkAsSold = async (_ctx: restate.RpcContext) => {
  return true;
};

export const ticketDbRouter = restate.keyedRouter({
  reserve: doReserveTicket,
  unreserve: doUnreserveTicket,
  markAsSold: doMarkAsSold,
});

export const ticketServiceApi: restate.ServiceApi<typeof ticketDbRouter> = {
  path: "TicketService",
};
