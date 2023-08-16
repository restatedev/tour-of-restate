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

enum TicketStatus {
  Available,
  Reserved,
  Sold,
}

const doReserveTicket = async (ctx: restate.RpcContext) => {
  const status =
    (await ctx.get<TicketStatus>("status")) || TicketStatus.Available;

  if (status === TicketStatus.Available) {
    ctx.set("status", TicketStatus.Reserved);
    return true;
  } else {
    return false;
  }
};

const doUnreserveTicket = async (ctx: restate.RpcContext) => {
  const status =
    (await ctx.get<TicketStatus>("status")) || TicketStatus.Available;

  if (status === TicketStatus.Sold) {
    return false;
  } else {
    ctx.clear("status");
    return true;
  }
};

const doMarkAsSold = async (ctx: restate.RpcContext) => {
  const status =
    (await ctx.get<TicketStatus>("status")) || TicketStatus.Available;

  if (status === TicketStatus.Reserved) {
    ctx.set("status", TicketStatus.Sold);
    return true;
  } else {
    return false;
  }
};

export const ticketDbRouter = restate.keyedRouter({
  reserve: doReserveTicket,
  unreserve: doUnreserveTicket,
  markAsSold: doMarkAsSold,
});

export const ticketServiceApi: restate.ServiceApi<typeof ticketDbRouter> = {
  path: "TicketService",
};
