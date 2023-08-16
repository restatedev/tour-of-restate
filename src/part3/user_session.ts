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
import { ticketServiceApi } from "./ticket_service";
import { checkoutApi } from "./checkout";

const doAddTicket = async (
  ctx: restate.RpcContext,
  userId: string,
  ticketId: string,
) => {
  const reservationSuccess = await ctx.rpc(ticketServiceApi).reserve(ticketId);

  if (reservationSuccess) {
    const tickets = (await ctx.get<string[]>("tickets")) || [];
    tickets.push(ticketId);
    ctx.set("tickets", tickets);

    ctx
      .sendDelayed(userSessionApi, 15 * 60 * 1000)
      .expireTicket(userId, ticketId);
  }

  return reservationSuccess;
};

const doExpireTicket = async (
  ctx: restate.RpcContext,
  userId: string,
  ticketId: string,
) => {
  const tickets = (await ctx.get<string[]>("tickets")) || [];

  const ticketIndex = tickets.findIndex((ticket) => ticket === ticketId);

  if (ticketIndex != -1) {
    tickets.splice(ticketIndex, 1);
    ctx.set("tickets", tickets);

    ctx.send(ticketServiceApi).unreserve(ticketId);
  }
};

const doCheckout = async (ctx: restate.RpcContext, userId: string) => {
  const tickets = await ctx.get<string[]>("tickets");

  if (tickets && tickets.length > 0) {
    const checkout_success = await ctx
      .rpc(checkoutApi)
      .checkout({ userId: userId, tickets: tickets! });

    if (checkout_success) {
      // mark tickets as sold if checkout was successful
      for (const ticket_id of tickets) {
        ctx.send(ticketServiceApi).markAsSold(ticket_id);
      }
      ctx.clear("tickets");
    }

    return checkout_success;
  } else {
    // no tickets reserved
    return false;
  }
};

export const userSessionRouter = restate.keyedRouter({
  addTicket: doAddTicket,
  expireTicket: doExpireTicket,
  checkout: doCheckout,
});

export const userSessionApi: restate.ServiceApi<typeof userSessionRouter> = {
  path: "UserSession",
};
