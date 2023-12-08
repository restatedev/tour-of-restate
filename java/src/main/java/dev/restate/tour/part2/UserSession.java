package dev.restate.tour.part2;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.protobuf.BoolValue;
import dev.restate.sdk.RestateContext;
import dev.restate.sdk.common.StateKey;
import dev.restate.sdk.common.TerminalException;
import dev.restate.sdk.serde.jackson.JacksonSerdes;
import dev.restate.tour.generated.*;
import dev.restate.tour.generated.Tour.*;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

public class UserSession extends UserSessionRestate.UserSessionRestateImplBase {


    public static final StateKey<Set<String>> STATE_KEY = StateKey.of("tickets", JacksonSerdes.of(new TypeReference<>() {}));

    @Override
    public BoolValue addTicket(RestateContext ctx, ReserveTicket request) throws TerminalException {
        var ticketSvcClient = TicketServiceRestate.newClient(ctx);
        var ticket = Ticket.newBuilder().setTicketId(request.getTicketId()).build();
        var reservationSuccess = ticketSvcClient.reserve(ticket).await();

        if (reservationSuccess.getValue()) {
            var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);
            tickets.add(request.getTicketId());
            ctx.set(STATE_KEY, tickets);

            ctx.delayedCall(UserSessionGrpc.getExpireTicketMethod(),
                    ExpireTicketRequest.newBuilder().setTicketId(request.getTicketId()).setUserId(request.getUserId()).build(),
                    Duration.ofMinutes(15));
        }

        return reservationSuccess;
    }

    @Override
    public void expireTicket(RestateContext ctx, ExpireTicketRequest request) throws TerminalException {
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        var removed = tickets.removeIf(s -> s.equals(request.getTicketId()));

        if (removed) {
            ctx.set(STATE_KEY, tickets);

            ctx.oneWayCall(
                    TicketServiceGrpc.getUnreserveMethod(),
                    Ticket.newBuilder().setTicketId(request.getTicketId()).build()
            );
        }
    }

    @Override
    public BoolValue checkout(RestateContext ctx, CheckoutRequest request) throws TerminalException {
        var tickets = ctx.get(STATE_KEY).orElseGet(HashSet::new);

        if (tickets.isEmpty()) {
            return BoolValue.of(false);
        }

        var req = CheckoutFlowRequest
                .newBuilder()
                .setUserId(request.getUserId())
                .addAllTickets(tickets)
                .build();
        var client = CheckoutRestate.newClient(ctx);
        var checkoutSuccess = client.checkout(req).await();

        if (checkoutSuccess.getValue()) {
            ctx.clear(STATE_KEY);
        }

        return checkoutSuccess;
    }
}
